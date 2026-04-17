import mongoose from "mongoose";
import User from "./src/models/User.js";
import Organization from "./src/models/Organization.js";
import Transaction from "./src/models/Transaction.js";
import dotenv from "dotenv";

dotenv.config();

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    // Delete existing SUPER_ADMIN
    await User.deleteMany({ email: "dipak908@gmail.com" });
    console.log("✓ Deleted old SUPER_ADMIN");

    // Delete test organization
    await Organization.deleteMany({ name: "Test Organization" });
    console.log("✓ Deleted old organization");

    // Delete sample transactions
    await Transaction.deleteMany({ userId: { $exists: true } });
    console.log("✓ Deleted old transactions");

    console.log("\n✓ Database cleaned! Now run: node seed-super-admin.js");
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup error:", error.message);
    process.exit(1);
  }
}

cleanup();
