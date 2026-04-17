import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import {
  getBudgetStatus,
  getBudgetStatusForUsers,
  validateBudgetForTransaction,
  calculateExpenseForPeriod
} from "../utils/budgetHelpers.js";

/**
 * Get current user's budget status
 * GET /api/budget/my-status
 */
export const getMyBudgetStatus = async (req, res) => {
  try {
    if (!req.user.organizationId) {
      return res.status(403).json({
        message: "User must belong to an organization"
      });
    }

    const budgetStatus = await getBudgetStatus(req.user._id, req.user.organizationId);

    res.json({
      message: "Budget status retrieved successfully",
      budgetStatus
    });
  } catch (error) {
    console.error("Get budget status error:", error);
    res.status(500).json({ message: "Error fetching budget status" });
  }
};

/**
 * Get all users' budget status (ORG_ADMIN only)
 * GET /api/budget/organization
 */
export const getOrganizationBudgetStatus = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({
        message: "Only ORG_ADMIN can view all budgets"
      });
    }

    // Get all users in organization
    const users = await User.find({
      organizationId: req.user.organizationId
    }).select("_id");

    const userIds = users.map(u => u._id);

    // Get budget status for all users
    const budgetStatuses = await getBudgetStatusForUsers(userIds, req.user.organizationId);

    // Combine with user details
    const userBudgets = await Promise.all(
      users.map(async (user, index) => ({
        userId: user._id,
        userName: (await User.findById(user._id)).name,
        userEmail: (await User.findById(user._id)).email,
        ...budgetStatuses[index]
      }))
    );

    // Sort by alert status (alerted first) and then by percentage descending
    const sortedBudgets = userBudgets.sort((a, b) => {
      if (b.alert !== a.alert) return b.alert - a.alert;
      return b.percentage - a.percentage;
    });

    res.json({
      message: "Organization budget status retrieved successfully",
      count: sortedBudgets.length,
      userBudgets: sortedBudgets
    });
  } catch (error) {
    console.error("Get organization budget status error:", error);
    res.status(500).json({ message: "Error fetching organization budget status" });
  }
};

/**
 * Validate if adding transaction would exceed budget
 * POST /api/budget/validate
 */
export const validateTransaction = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Valid amount is required"
      });
    }

    if (!req.user.organizationId) {
      return res.status(403).json({
        message: "User must belong to an organization"
      });
    }

    const validation = await validateBudgetForTransaction(
      req.user._id,
      req.user.organizationId,
      amount
    );

    res.json({
      message: "Budget validation completed",
      validation
    });
  } catch (error) {
    console.error("Validate transaction error:", error);
    res.status(500).json({ message: "Error validating transaction" });
  }
};

/**
 * Update user budget (ORG_ADMIN only)
 * POST /api/budget/set-user-budget
 */
export const setUserBudget = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({
        message: "Only ORG_ADMIN can set budgets"
      });
    }

    const { userId, budget, budgetPeriod } = req.body;

    if (!userId || budget === undefined) {
      return res.status(400).json({
        message: "User ID and budget are required"
      });
    }

    if (budget < 0) {
      return res.status(400).json({
        message: "Budget must be non-negative"
      });
    }

    const validPeriods = ["weekly", "monthly", "yearly"];
    const period = budgetPeriod && validPeriods.includes(budgetPeriod) ? budgetPeriod : "monthly";

    // Verify user belongs to same organization
    const targetUser = await User.findById(userId);
    if (!targetUser || targetUser.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({
        message: "Cannot update user from different organization"
      });
    }

    // Update budget
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        budget,
        budgetPeriod: period
      },
      { new: true }
    ).select("-password");

    // Get new budget status
    const budgetStatus = await getBudgetStatus(userId, req.user.organizationId);

    res.json({
      message: "User budget updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        budget,
        budgetPeriod: period
      },
      budgetStatus
    });
  } catch (error) {
    console.error("Set user budget error:", error);
    res.status(500).json({ message: "Error updating budget" });
  }
};

/**
 * Get budget history for current user
 * GET /api/budget/history
 */
export const getBudgetHistory = async (req, res) => {
  try {
    if (!req.user.organizationId) {
      return res.status(403).json({
        message: "User must belong to an organization"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user || !user.budget) {
      return res.status(404).json({
        message: "No budget set for this user"
      });
    }

    // Get transactions for the current period
    const now = new Date();
    const startDate = new Date();

    switch (user.budgetPeriod) {
      case "weekly":
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startDate.setDate(diff);
        break;
      case "yearly":
        startDate.setMonth(0, 1);
        break;
      case "monthly":
      default:
        startDate.setDate(1);
    }

    startDate.setHours(0, 0, 0, 0);

    // Get expenses grouped by category
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          organizationId: req.user.organizationId,
          type: "expense",
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { amount: -1 }
      }
    ]);

    const totalExpenses = categoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0);

    res.json({
      message: "Budget history retrieved successfully",
      budget: {
        budgetAmount: Math.round(user.budget * 100) / 100,
        budgetPeriod: user.budgetPeriod,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        budgetRemaining: Math.round(Math.max(0, user.budget - totalExpenses) * 100) / 100,
        percentage: Math.round((totalExpenses / user.budget) * 10000) / 100,
        periodStart: startDate.toISOString(),
        periodEnd: now.toISOString()
      },
      categoryBreakdown: categoryBreakdown.map(cat => ({
        category: cat._id,
        amount: Math.round(cat.amount * 100) / 100,
        count: cat.count,
        percentage: Math.round((cat.amount / totalExpenses) * 10000) / 100
      }))
    });
  } catch (error) {
    console.error("Get budget history error:", error);
    res.status(500).json({ message: "Error fetching budget history" });
  }
};
