import mongoose from "mongoose";
import User from "./User";

const quizSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
    },

    isComplete: {
      type: Boolean,
      default: false,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        opt1: {
          type: String,
          required: true,
          isCorrect: false,
        },
        opt2: {
          type: String,
          required: true,
          isCorrect: false,
        },
        opt3: {
          type: String,
          required: true,
          isCorrect: false,
        },
        opt4: {
          type: String,
          required: true,
          isCorrect: false,
        },
      },
    ],
  },
  {
    timestapms: true,
  },
);

quizSchema.index({ owner: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
