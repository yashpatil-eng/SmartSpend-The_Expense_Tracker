import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Profile from "../models/Profile.js";

export const updateUser = async (req, res) => {
  const { name, email, mobile, currency, theme, language, password, avatar } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (email) updates.email = email.toLowerCase();
  if (mobile) updates.mobile = mobile.replace(/\D/g, "");
  if (currency) updates.currency = currency;
  if (theme && ["dark", "light"].includes(theme)) updates.theme = theme;
  if (language) updates["preferences.language"] = language;
  if (avatar) updates.avatar = avatar;
  if (password) {
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    updates.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
  return res.json({ user });
};

export const deleteUser = async (req, res) => {
  await Promise.all([
    User.findByIdAndDelete(req.user._id),
    Profile.findOneAndDelete({ userId: req.user._id }),
    Transaction.deleteMany({ userId: req.user._id })
  ]);
  return res.json({ message: "Account deleted successfully" });
};
