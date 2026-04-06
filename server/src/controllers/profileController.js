import Profile from "../models/Profile.js";
import User from "../models/User.js";

export const createOrUpdateProfile = async (req, res) => {
  const { income, savingsGoal, categories, spendingHabit, goal } = req.body;
  if (income === undefined || savingsGoal === undefined || !spendingHabit || !goal) {
    return res.status(400).json({ message: "Missing required onboarding fields" });
  }

  const normalizedCategories = Array.isArray(categories)
    ? [...new Set(categories.filter(Boolean).map((item) => item.trim()))]
    : [];

  const profile = await Profile.findOneAndUpdate(
    { userId: req.user._id },
    { income, savingsGoal, categories: normalizedCategories, spendingHabit, goal },
    { new: true, upsert: true }
  );

  await User.findByIdAndUpdate(req.user._id, { onboardingCompleted: true });

  return res.json(profile);
};

export const getProfile = async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id });
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }
  return res.json(profile);
};
