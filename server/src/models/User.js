import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true, sparse: true },
    password: { type: String, minlength: 6 },
    mobile: { type: String, unique: true, sparse: true, trim: true },
    role: { type: String, enum: ["personal", "organization"], default: "personal" },
    organizationName: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String, trim: true },
    onboardingCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
