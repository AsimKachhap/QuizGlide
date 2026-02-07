import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// SIGNUP

export const signup = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing." });
  }
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are reqiured." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters long." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid Email adddress." });
    }

    const user = new User({
      name,
      email,
      password,
    });

    const token = generateToken({ user_id: user._id });
    await user.save();

    return res.status(201).json({
      message: "User created SUCCESSFULLY.",
      data: user,
      token: token,
    });
  } catch (error) {
    console.log("Signup FAILED", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while Registering." });
  }
};
