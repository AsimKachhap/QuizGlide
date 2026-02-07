import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not signed in. Sign in to get access.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.user_id);

    if (!user) {
      return req.status(401).json({
        message: "Unauthorized to access.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "FAILED to Authenticate User.",
    });
  }
};
