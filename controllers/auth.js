import User from "../models/User.js";
import bcrypt from "bcryptjs";
import createError from "../utils/create-error.js";
import jwt from "jsonwebtoken";
import lowercaseString from "../utils/lowercase-string.js";
import validatePassword from "../utils/validate-password.js";

export async function signUp(req, res, next) {
  try {
    const { name, email, password, confirm_password } = req.body;

    if (!name || !email || !password || !confirm_password) {
      return next(createError(400, "Missing required fields"));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(createError(400, "Email not available"));
    }

    if (password !== confirm_password) {
      return next(createError(400, "Passwords do not match"));
    }

    if (!validatePassword(password)) {
      return next(
        createError(
          400,
          "Password must have at least 1 uppercase letter, 1 number, and be at least 8 characters long"
        )
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      email: lowercaseString(email),
      password: hashed_password,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}

export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Missing required fields"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(400, "Invalid email or password"));
    }

    const is_password_valid = await bcrypt.compare(password, user.password);

    if (!is_password_valid) {
      return next(createError(400, "Invalid email or password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    user.password = undefined;

    res.status(200).json({
      message: "User logged in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}

export async function verifySession(req, res, next) {
  try {
    const user_id = req.user.id;

    const user = await User.findById(user_id).select("-password");

    if (!user) {
      return next(createError(401, "User not found"));
    }

    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Session verified successfully",
      data: {
        user,
        token: newToken,
      },
    });
  } catch (error) {
    return next(createError(500, "Error verifying session"));
  }
}
