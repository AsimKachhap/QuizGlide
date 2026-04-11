import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import Quiz from "../models/Quiz.js";

function sendJSON(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function broadcastToEvent(eventPlayers, eventId, payload) {
  if (eventPlayers.has(eventId)) {
    for (const socket of eventPlayers.get(eventId)) {
      sendJSON(socket, payload);
    }
  }
}

// Authenticate WebSocket connection using JWT from URL query
async function authenticateWebSocket(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");
    const eventId = url.searchParams.get("eventId");

    if (!token || !eventId) {
      throw new Error("Missing token or eventId");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const quiz = await Quiz.findById(eventId);

    if (!quiz) {
      throw new Error("Event not found");
    }

    return { userId: decoded.user_id, eventId, quiz };
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  const eventPlayers = new Map(); // Track authenticated players per event

  wss.on("connection", async (socket, req) => {
    try {
      // Authenticate before accepting connection
      const { userId, eventId, quiz } = await authenticateWebSocket(req);

      // Check if event is not complete
      if (quiz.isComplete) {
        sendJSON(socket, {
          type: "ERROR",
          message: "This event has ended.",
        });
        socket.close(1008, "Event already complete");
        return;
      }

      // Store authenticated context on socket
      socket.userId = userId;
      socket.eventId = eventId;

      // Add to event players
      if (!eventPlayers.has(eventId)) {
        eventPlayers.set(eventId, new Set());
      }
      eventPlayers.get(eventId).add(socket);

      console.log(`Authenticated user ${userId} joined event ${eventId}`);

      // Notify others
      broadcastToEvent(eventPlayers, eventId, {
        type: "PLAYER_JOINED",
        userId,
        totalPlayers: eventPlayers.get(eventId).size,
      });

      sendJSON(socket, {
        type: "CONNECTED",
        eventId,
        message: "Successfully connected to event",
      });
    } catch (error) {
      console.error("WebSocket auth error:", error);
      sendJSON(socket, { type: "ERROR", message: error.message });
      socket.close(1008, "Authentication failed");
      return;
    }

    socket.on("message", (data) => {
      // Only process messages from authenticated players
      if (!socket.userId || !socket.eventId) return;

      try {
        const message = JSON.parse(data);
        // Handle quiz events, answers, etc.
        broadcastToEvent(eventPlayers, socket.eventId, message);
      } catch (error) {
        console.error("Message error:", error);
      }
    });

    socket.on("close", () => {
      if (socket.eventId && eventPlayers.has(socket.eventId)) {
        eventPlayers.get(socket.eventId).delete(socket);

        broadcastToEvent(eventPlayers, socket.eventId, {
          type: "PLAYER_LEFT",
          userId: socket.userId,
          totalPlayers: eventPlayers.get(socket.eventId).size,
        });

        if (eventPlayers.get(socket.eventId).size === 0) {
          eventPlayers.delete(socket.eventId);
        }
      }
    });

    socket.on("error", console.error);
  });
}
