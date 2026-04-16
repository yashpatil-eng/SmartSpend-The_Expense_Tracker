import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import User from "./src/models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function seedAdminGmail() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@gmail.com";
    const adminPassword = "Admin@123";

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
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        mobile: "9876543210",
        role: "admin",
        accountRole: "personal",
        avatar: "",
        onboardingCompleted: true,
        isActive: true
      });
      console.log("✓ Admin user created successfully!");
      console.log("  Email:", adminEmail);
      console.log("  Password:", adminPassword);
      console.log("  Role: admin");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
}

seedAdminGmail();
