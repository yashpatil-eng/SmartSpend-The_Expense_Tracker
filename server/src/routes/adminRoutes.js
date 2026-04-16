import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  getAllTransactions,
  deleteTransaction,
  getDashboardStats,
  getSystemHealth
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// User Management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/status", toggleUserStatus);

// Transaction Management
router.get("/transactions", getAllTransactions);
router.delete("/transactions/:id", deleteTransaction);

// Dashboard Stats
router.get("/stats", getDashboardStats);

// System Health
router.get("/health", getSystemHealth);

export default router;
