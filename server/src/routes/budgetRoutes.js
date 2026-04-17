import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getMyBudgetStatus,
  getOrganizationBudgetStatus,
  validateTransaction,
  setUserBudget,
  getBudgetHistory
} from "../controllers/budgetController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get current user's budget status
router.get("/my-status", getMyBudgetStatus);

// Get budget history for current period
router.get("/history", getBudgetHistory);

// Validate if transaction would exceed budget
router.post("/validate", validateTransaction);

// ORG_ADMIN only routes
router.get("/organization", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), getOrganizationBudgetStatus);
router.post("/set-user-budget", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), setUserBudget);

export default router;
