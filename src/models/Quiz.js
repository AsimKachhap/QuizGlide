import mongoose from "mongoose";

const quizSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
          isCorrect: {
            type: Boolean,
            default: false,
          },
        },
        opt2: {
          type: String,
          required: true,
          isCorrect: {
            type: Boolean,
            default: false,
          },
        },
        opt3: {
          type: String,
          required: true,
          isCorrect: {
            type: Boolean,
            default: false,
          },
        },
        opt4: {
          type: String,
          required: true,
          isCorrect: {
            type: Boolean,
            default: false,
          },
        },
      },
    ],
  },
  {
    timestapms: true,
  },
);

quizSchema.index({ owner: 1, isComplete: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
