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

    const adminEmail = "khillaredipak908@gmail.com";
    const adminPassword = "Dipak@123";

    // Check if admin already exists by email
    let admin = await User.findOne({ email: adminEmail });
    
    if (admin) {
      // Update existing admin's password
      admin.password = await bcrypt.hash(adminPassword, 10);
      admin.role = "admin";
      admin.accountRole = "personal";
      admin.onboardingCompleted = true;
      admin.isActive = true;
      await admin.save();
      console.log("✓ Admin user updated successfully!");
      console.log("  Email:", adminEmail);
      console.log("  Password:", adminPassword);
      console.log("  Role: admin");
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = await User.create({
        name: "Dipak (Admin)",
        email: adminEmail,
        password: hashedPassword,
        mobile: "98764532" + Math.floor(Math.random() * 100), // Random suffix to avoid duplicates
        role: "admin",
        accountRole: "personal",
        avatar: "",
        onboardingCompleted: true,
        isActive: true
      });
      console.log("✓ Admin user created successfully!");
      console.log("  Email:", adminEmail);
      console.log("  Password:", adminPassword);
    }

    console.log("\n✓ You can now login as admin with these credentials");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
}

seedCustomAdmin();
