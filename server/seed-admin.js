import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import User from "./src/models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("✓ Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin@123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@smartspend.local",
      password: hashedPassword,
      mobile: "8888888888",
      role: "admin",
      accountRole: "personal",
      avatar: "",
      onboardingCompleted: true,
      isActive: true
    });

    console.log("✓ Admin user created successfully!");
    console.log("  Email: admin@smartspend.local");
    console.log("  Password: admin@123");
    console.log("\nPlease change password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
}

seedAdmin();
