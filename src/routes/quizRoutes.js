import express from "express";
import { createQuiz } from "../controllers/quizController.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/", authenticate, createQuiz);

export default router;
