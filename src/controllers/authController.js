import User from "../models/User.js";
import bcrypt from "bcryptjs";
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

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password is Required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        const token = generateToken({ user_id: user._id });
        await user.save();
        res.status(200).json({
          message: "Logged In SUCCESSFULLY.",
          data: user,
          token: token,
        });
      } else {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
    } else {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(`Error while loggging the user. User : ${req.ip}`, error);
    res.status(500).json({
      message: "Something went wrong while log in. ",
    });
  }
};
