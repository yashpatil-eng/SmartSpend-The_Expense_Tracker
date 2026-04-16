import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import User from "./src/models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function seedCustomAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // ⚠️ NOTE: Admin is now hardcoded only (admin@gmail.com / Admin@123)
    // Admin users are NO LONGER created in the database.
    // This seed file now creates a regular TEST USER instead.

    const testEmail = "khillaredipak908@gmail.com";
    const testPassword = "Dipak@123";

    // Check if test user already exists by email
    let user = await User.findOne({ email: testEmail });
    
    if (user) {
      // Update existing user
      user.password = await bcrypt.hash(testPassword, 10);
      user.role = "user"; // ✅ Only "user" role allowed
      user.accountRole = "personal";
      user.onboardingCompleted = true;
      user.isActive = true;
      await user.save();
      console.log("✓ Test user updated successfully!");
      console.log("  Email:", testEmail);
      console.log("  Password:", testPassword);
      console.log("  Role: user");
    } else {
      // Create new test user
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      user = await User.create({
        name: "Dipak (Test User)",
        email: testEmail,
        password: hashedPassword,
        mobile: "98764532" + Math.floor(Math.random() * 100),
        role: "user", // ✅ Only "user" role allowed
        accountRole: "personal",
        avatar: "",
        onboardingCompleted: true,
        isActive: true
      });
      console.log("✓ Test user created successfully!");
      console.log("  Email:", testEmail);
      console.log("  Password:", testPassword);
      console.log("  Role: user");
    }

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

seedCustomAdmin();
