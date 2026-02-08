import Quiz from "../models/Quiz.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// GET ALL QUIZZES

export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ owner: req.user });
    console.log(quizzes);
  } catch (error) {
    console.log("Something went wrong while fetching all quizzes.", error);
    res.status(500).json({
      message: "Something went wrong while  getting  all quizzes.",
    });
  }
};

export const createQuiz = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.log("Something went wrong while creating Quiz.", error);
    res.status(500).json({
      message: "Something went wrong while  creating Quiz.",
    });
  }
};
