import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [optionSchema],
      required: true,
      validate: [
        {
          validator: (v) => v.length === 4,
          message: "Exactly 4 options are required",
        },
        {
          validator: (v) => v.filter((opt) => opt.isCorrect).length === 1,
          message: "Exactly one option must be correct",
        },
      ],
    },
  },
  { _id: true },
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    passcode: {
      type: String,
      required: true,
      minlength: 6,
    },

    isComplete: {
      type: Boolean,
      default: false,
      index: true,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

quizSchema.index({ owner: 1, isComplete: 1 }, { unique: true });

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
