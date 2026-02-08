import Quiz from "../models/Quiz.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// GET ALL QUIZZES
export const getMyQuizzes = async (req, res) => {
  console.log("User : ", req.user);
  try {
    const quizzes = await Quiz.find({ owner: req.user });
    return res.status(200).json({
      message: "SUCCESSFULLY fetched all quizzes.",
      data: quizzes,
    });
  } catch (error) {
    console.log("Something went wrong while fetching all quizzes.", error);
    res.status(500).json({
      message: "Something went wrong while  getting  all quizzes.",
    });
  }
};

//CREATE QUIZ
export const createQuiz = async (req, res) => {
  try {
    console.log("Owner: ", req.user);
    const { title } = req.body;
    if (!title) {
      console.log("Quiz Title is missing.");
      res.status(400).json({
        message: "Quiz Title is required.",
      });
    }
    const quiz = new Quiz({ title: title, owner: req.user._id });
    console.log(quiz);
    await quiz.save();
    return res.status(201).json({
      message: "Quiz created SUCCESSFULLY.",
      data: quiz,
    });
  } catch (error) {
    console.log("Something went wrong while creating Quiz.", error);
    res.status(500).json({
      message: "Something went wrong while  creating Quiz.",
    });
  }
};
