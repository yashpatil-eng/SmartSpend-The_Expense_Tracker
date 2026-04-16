import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { generateToken } from "../utils/token.js";

// Admin Creation - Only accessible by authenticated admin users
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Check if email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newAdmin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      accountRole: "personal",
      onboardingCompleted: true,
      isActive: true,
      mobile: `admin_${Date.now()}` // Temporary placeholder
    });

    console.log(`✓ Admin created successfully: ${normalizedEmail} by ${req.user.email}`);

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error("Create admin error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Failed to create admin" });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin" && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Cannot delete other admin accounts" });
    }

    // Delete user's transactions
    await Transaction.deleteMany({ userId: id });

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

// Transaction Management
export const getAllTransactions = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};

    if (userId) {
      query.userId = userId;
    }

    const transactions = await Transaction.find(query)
      .populate("userId", "name email mobile")
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    console.error("Get all transactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const activeUsers = await User.countDocuments({ isActive: true, role: "user" });

    const totalTransactions = await Transaction.countDocuments();

    const incomeTransactions = await Transaction.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expenseTransactions = await Transaction.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalIncome = incomeTransactions[0]?.total || 0;
    const totalExpenses = expenseTransactions[0]?.total || 0;

    // Get category-wise breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalAdmins,
      activeUsers,
      totalTransactions,
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      categoryBreakdown,
      recentTransactions
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// System Health
export const getSystemHealth = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const transactionsCount = await Transaction.countDocuments();
    const databaseConnected = usersCount !== null && transactionsCount !== null;

    res.json({
      status: "healthy",
      database: databaseConnected ? "connected" : "disconnected",
      usersCount,
      transactionsCount,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("System health check error:", error);
    res.status(500).json({ message: "System health check failed" });
  }
};
