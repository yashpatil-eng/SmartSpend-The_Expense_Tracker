import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import User from "./src/models/User.js";
import Organization from "./src/models/Organization.js";
import Transaction from "./src/models/Transaction.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

const generateOrgCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "ORG-";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const generateInviteLink = (orgCode) => {
  return `/join/org/${orgCode}`;
};

async function seedSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    // Check if SUPER_ADMIN already exists
    const existingSuperAdmin = await User.findOne({ email: "dipak908@gmail.com" });
    if (existingSuperAdmin) {
      console.log("✓ SUPER_ADMIN already exists:", existingSuperAdmin.email);
      process.exit(0);
    }

    // Create SUPER_ADMIN user with provided credentials
    const hashedPassword = await bcrypt.hash("Dipak@123", 10);
    const superAdmin = await User.create({
      name: "Super Administrator",
      email: "dipak908@gmail.com",
      password: hashedPassword,
      mobile: "9999999999",
      accountRole: "personal",
      orgRole: "SUPER_ADMIN",
      avatar: "",
      onboardingCompleted: true,
      isActive: true
    });

    console.log("✓ SUPER_ADMIN user created successfully!");
    console.log("  Email: dipak908@gmail.com");
    console.log("  Password: Dipak@123");

    // Create test organization
    let orgCode = generateOrgCode();
    let codeExists = await Organization.findOne({ orgCode });
    
    while (codeExists) {
      orgCode = generateOrgCode();
      codeExists = await Organization.findOne({ orgCode });
    }

    const testOrg = await Organization.create({
      name: "Test Organization",
      orgCode,
      inviteLink: generateInviteLink(orgCode),
      createdBy: superAdmin._id,
      admins: [superAdmin._id],
      users: [superAdmin._id],
      description: "Default test organization for development"
    });

    // Update SUPER_ADMIN to have organizationId
    await User.findByIdAndUpdate(superAdmin._id, {
      organizationId: testOrg._id
    });

    console.log("\n✓ Test Organization created successfully!");
    console.log("  Organization Name: Test Organization");
    console.log("  Organization Code: " + orgCode);
    console.log("  Invite Link: /join/org/" + orgCode);

    // Create a MANAGER user for the organization
    const managerPassword = await bcrypt.hash("Manager@123", 10);
    const manager = await User.create({
      name: "Organization Manager",
      email: "manager@test.com",
      password: managerPassword,
      mobile: "8888888888",
      accountRole: "organization",
      orgRole: "MANAGER",
      organizationId: testOrg._id,
      onboardingCompleted: true,
      isActive: true
    });

    console.log("\n✓ MANAGER user created for organization!");
    console.log("  Email: manager@test.com");
    console.log("  Password: Manager@123");
    console.log("  Role: Organization Manager (can see and handle all org data)");

    // Update organization to include manager
    await Organization.findByIdAndUpdate(testOrg._id, {
      $addToSet: { admins: manager._id, users: manager._id }
    });

    // Create sample transactions to populate dashboard
    const sampleTransactions = [
      {
        userId: manager._id,
        organizationId: testOrg._id,
        amount: 5000,
        type: "income",
        category: "Salary",
        notes: "Monthly salary",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        items: []
      },
      {
        userId: manager._id,
        organizationId: testOrg._id,
        amount: 1200,
        type: "expense",
        category: "Food",
        notes: "Groceries and dining",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        items: []
      },
      {
        userId: manager._id,
        organizationId: testOrg._id,
        amount: 800,
        type: "expense",
        category: "Transport",
        notes: "Fuel and transportation",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        items: []
      },
      {
        userId: manager._id,
        organizationId: testOrg._id,
        amount: 2000,
        type: "expense",
        category: "Entertainment",
        notes: "Movies and subscription",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        items: []
      },
      {
        userId: manager._id,
        organizationId: testOrg._id,
        amount: 1500,
        type: "income",
        category: "Freelance",
        notes: "Project payment",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        items: []
      }
    ];

    await Transaction.insertMany(sampleTransactions);
    console.log("✓ Sample transactions created!");
    console.log("  - 2 Income transactions (Salary, Freelance)");
    console.log("  - 3 Expense transactions (Food, Transport, Entertainment)");

    console.log("\n✓ Seeding completed! You can now:");
    console.log("  1. SUPER ADMIN - Login with dipak908@gmail.com / Dipak@123");
    console.log("  2. MANAGER - Login with manager@test.com / Manager@123");
    console.log("  3. Both can access the admin dashboard");
    console.log("\n⚠️  Please change password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding SUPER_ADMIN:", error.message);
    process.exit(1);
  }
}

seedSuperAdmin();
