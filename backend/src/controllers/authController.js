import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const allowedRoles = ["admin", "teacher", "student"];

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "student" } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required.");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters.");
  }

  if (!allowedRoles.includes(role)) {
    res.status(400);
    throw new Error("Invalid role value.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(409);
    throw new Error("Email is already in use.");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role,
  });

  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json({
    message: "Registration successful.",
    token,
    user: serializeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const token = generateToken({ id: user._id, role: user.role });

  res.status(200).json({
    message: "Login successful.",
    token,
    user: serializeUser(user),
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});
