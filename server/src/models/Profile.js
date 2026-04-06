import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    income: { type: Number, required: true, min: 0 },
    savingsGoal: { type: Number, required: true, min: 0 },
    categories: [{ type: String, trim: true }],
    spendingHabit: { type: String, enum: ["low", "medium", "high"], required: true },
    goal: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
