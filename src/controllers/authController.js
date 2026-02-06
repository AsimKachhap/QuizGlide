import mongoose from mongoose;
import User from "../models/User.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  console.log("This is sign up controller.");
  res.send("Welcome to signup route.");
};
