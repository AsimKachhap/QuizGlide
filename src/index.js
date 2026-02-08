import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./db/connectDb.js";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      //Add production url
    ],
    credentials: true,
  }),
);

const PORT = process.env.PORT || 8080;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quizzes", quizRoutes);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(PORT, () => {
  connectDb();
  console.log(`SERVER is up and running on PORT : ${PORT}`);
});
