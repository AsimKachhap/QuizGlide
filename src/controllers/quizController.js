import Quiz from "../models/Quiz.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// GET ALL QUIZZES
export const getMyQuizzes = async (req, res) => {
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

//GET QUIZ BY ID
export const getQuizById = async (req, res) => {
  const { quizId } = req.params;
  console.log(quizId);
  if (!quizId) {
    return res.status(400).json({
      mmessage: "Quiz Id is missing in req params.",
    });
  }
  try {
    const quiz = await Quiz.findOne({ _id: quizId });
    if (quiz === null) {
      return res.status(404).json({
        message: "No Quiz was found with this id.",
        data: quiz,
      });
    }
    return res.status(200).json({
      message: "SUCCESSFULLY fetched the quiz.",
      data: quiz,
    });
  } catch (error) {
    console.log("Something went wrong while fetching quiz by id.", error);
    res.status(500).json({
      message: "Something went wrong while getting the quiz.",
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

//ADD QUESTIONS
export const addQuestion = async (req, res) => {
  const { quizId } = req.params;
  const { question, options } = req.body;

  if (!question || !Array.isArray(options)) {
    return res.status(400).json({
      message: "Question and Options array is required.",
    });
  }

  if (options.length !== 4) {
    return res.status(400).json({
      message: "Exactly 4 options are required.",
    });
  }

  // Validate if quizId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({
      message: "Invalid quizId.",
    });
  }

  try {
    const quiz = await Quiz.findOneAndUpdate(
      {
        _id: quizId,
        owner: req.user._id,
        isComplete: false, // prevent editing completed quizzes
      },
      {
        $push: {
          questions: {
            question,
            options,
          },
        },
      },
      {
        new: true,
        runValidators: true, //REQUIRED for nested validation
      },
    );

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found or already completed",
      });
    }

    res.status(200).json({
      message: "Question added successfully",
      data: quiz.questions[quiz.questions.length - 1],
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.log("FAILED to add question.", error);

    res.status(500).json({
      message: "Failed to add question",
    });
  }
};

// UPDATE QUESTION
export const updateQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  console.log(`Quiz id: ${quizId}  &  Question id : ${questionId}`);
  const { question, options } = req.body;

  if (!question || !Array.isArray(options)) {
    return res.status(400).json({
      message: "Question and Options Array is required.",
    });
  }

  if (options.length != 4) {
    return res.status(400).json({
      message: "Exactly 4 options are Required",
    });
  }

  // Validate if quizId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({
      message: "Invalid quizId.",
    });
  }

  // Validate if questionId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({
      message: "Invalid questionId.",
    });
  }

  try {
    const quiz = await Quiz.findOneAndUpdate(
      {
        _id: quizId,
        "questions._id": questionId, // Why you need double quotes? Read You Don’t Know JS — Types & Grammar Chapter 5 :Grammar
        owner: req.user._id,
        isComplete: false, // prevent editing completed quizzes
      },
      {
        $set: {
          "questions.$.question": question,
          "questions.$.options": options,
        },
      },
      {
        new: true,
        runValidators: true, //REQUIRED for nested validation
      },
    );

    const ques = await Quiz.findOne({
      _id: quizId,
      "questions._id": questionId,
    });

    console.log("Ques : ", ques);
    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found or already completed",
      });
    }

    res.status(200).json({
      message: "Question updated successfully",
      data: quiz.questions[quiz.questions.length - 1],
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.log("FAILED to update question.", error);

    res.status(500).json({
      message: "Failed to update question",
    });
  }
};

// DEETE A QUESTION
export const deleteQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;

  // Validate if quizId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({
      message: "Invalid quizId.",
    });
  }

  // Validate if questionId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({
      message: "Invalid questionId.",
    });
  }

  try {
    const result = await Quiz.findOneAndDelete(
      {
        _id: quizId,
        "questions._id": questionId,
        owner: req.user._id,
        isComplete: false, // prevent editing completed quizzes
      },
      {
        $pull: {
          questions: { _id: questionId },
        },
      },
      {
        new: true,
      },
    );

    if (!result) {
      return res.status(404).json({
        message: "Question NOT FOUND.",
      });
    }

    return res.status(200).json({
      message: "Deleted the question SUCCESSFULLY.",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.log("FAILED to delete a question.", error);

    res.status(500).json({
      message: "Failed to delete the question",
    });
  }
};
