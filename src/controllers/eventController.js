import Quiz from "../models/Quiz.js";
import { generateToken } from "../utils/generateToken.js";

export const joinEvent = async (req, res) => {
  const { player, passcode } = req.body;
  const eventId = req.params.eventId;

  try {
    // Validate input
    if (!player || !passcode) {
      return res.status(400).json({
        message: "Player name and passcode are required.",
      });
    }

    // Find the quiz/event by ID
    const quiz = await Quiz.findById(eventId);

    if (!quiz) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    // Check if quiz is already complete
    if (quiz.isComplete) {
      return res.status(403).json({
        message: "This event has already ended.",
      });
    }

    // Verify passcode
    if (quiz.passcode !== passcode) {
      return res.status(401).json({
        message: "Invalid passcode.",
      });
    }

    // Generate JWT token for WebSocket authentication
    // For guest users, create a temporary guest ID
    const userId = req.user?._id || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const token = generateToken({ user_id: userId });

    // If all validations pass, provide secure WebSocket URL
    return res.status(200).json({
      message: "Successfully validated. Connect to WebSocket.",
      event: {
        id: quiz._id,
        title: quiz.title,
        totalQuestions: quiz.questions.length,
      },
      wsUrl: `ws://${process.env.WS_HOST || "localhost:3000"}/ws?token=${token}&eventId=${eventId}`,
    });
  } catch (error) {
    console.error("Something went wrong while joining the event.", error);
    return res.status(500).json({
      message: "Something went wrong on SERVER while joining the event.",
    });
  }
};
