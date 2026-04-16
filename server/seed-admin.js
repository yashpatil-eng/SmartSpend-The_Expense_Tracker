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

    // ⚠️ NOTE: Admin is now hardcoded only (admin@gmail.com / Admin@123)
    // Admin users are NO LONGER created in the database.
    // This seed file now creates a regular TEST USER instead.
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: "testuser@smartspend.local" });
    if (existingUser) {
      console.log("✓ Test user already exists:", existingUser.email);
      process.exit(0);
    }

    // Create test user (not admin)
    const hashedPassword = await bcrypt.hash("testuser@123", 10);
    const testUser = await User.create({
      name: "Test User",
      email: "testuser@smartspend.local",
      password: hashedPassword,
      mobile: "9999999999",
      role: "user", // ✅ Only role "user" now
      accountRole: "personal",
      avatar: "",
      onboardingCompleted: true,
      isActive: true
    });

    console.log("✓ Test user created successfully!");
    console.log("  Email: testuser@smartspend.local");
    console.log("  Password: testuser@123");
    console.log("  Role: user");
    console.log("\n📌 To login as admin, use:");
    console.log("  Email: admin@gmail.com");
    console.log("  Password: Admin@123");
    console.log("  (Hardcoded admin - NOT in database)");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding user:", error.message);
    process.exit(1);
  }
}

seedAdmin();
