import express from "express";
import {
  getMyQuizzes,
  createQuiz,
  getQuizById,
  addQuestion,
  updateQuestion,
} from "../controllers/quizController.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router(); //Keep an eye on Route shadowing.

router.get("/", authenticate, getMyQuizzes);
router.post("/", authenticate, createQuiz);
router.get("/:quizId", authenticate, getQuizById);
router.post("/:quizId/questions", authenticate, addQuestion);
router.patch("/:quizId/questions/:questionId", authenticate, updateQuestion);

//Quiz Routes to implement

// 5. router.patch("/:quizId/questions", updateQuestion)
// 6. router.delete("/:quizId/questions", deleteQuestion)
// 7. router.patch("/:quizId/complete", completeQuiz)
// 8. router.delete("/:quizId", deleteQuiz)

export default router;
