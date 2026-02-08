import express from "express";
import {
  getMyQuizzes,
  createQuiz,
  getQuizById,
} from "../controllers/quizController.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", authenticate, getMyQuizzes);
router.post("/", authenticate, createQuiz);
router.get("/:quizId", authenticate, getQuizById);

//Quiz Routes to implement

// 3. router.get("/:quizId", getQuizById)
// 4. router.post("/:quizId/questions", addQuestions)
// 5. router.patch("/:quizId/questions", updateQuestion)
// 6. router.delete("/:quizId/questions", deleteQuestion)
// 7. router.patch("/:quizId/complete", completeQuiz)
// 8. router.delete("/:quizId", deleteQuiz)

export default router;
