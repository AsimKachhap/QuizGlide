import express from "express";
import {
  getMyQuizzes,
  createQuiz,
  getQuizById,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  completeQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";
import { authenticate } from "../middlewares/authMiddlewares.js";

const router = express.Router(); //Keep an eye on Route shadowing.

router.get("/", authenticate, getMyQuizzes);
router.post("/", authenticate, createQuiz);
router.get("/:quizId", authenticate, getQuizById);
router.post("/:quizId/questions", authenticate, addQuestion);
router.patch("/:quizId/questions/:questionId", authenticate, updateQuestion);
router.delete("/:quizId/questions/:questionId", authenticate, deleteQuestion);
router.patch("/:quizId/complete", authenticate, completeQuiz);
router.delete("/:quizId", authenticate, deleteQuiz);

//Quiz Routes to implement
// 8. router.delete("/:quizId", deleteQuiz)

export default router;
