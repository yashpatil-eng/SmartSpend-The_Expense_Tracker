import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, onboardingCompleted: user.onboardingCompleted },
    token: generateToken(user._id)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    user: { id: user._id, name: user.name, email: user.email, onboardingCompleted: user.onboardingCompleted },
    token: generateToken(user._id)
  });
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};
