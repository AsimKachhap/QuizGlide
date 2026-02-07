import Quiz from "../models/Quiz.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const createQuiz = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Something went wrong while creating Quiz.", error);
    res.status(500).json({
      message: "Something went wrong while  creating Quiz.",
    });
  }
};
