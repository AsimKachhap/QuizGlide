import express from "express";
import { joinEvent } from "../controllers/eventController.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// For now, allow guest access to join events
// TODO: Consider requiring authentication for production
router.post("/:eventId", joinEvent);

export default router;
