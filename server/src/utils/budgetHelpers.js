import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

/**
 * Calculate user's expense total based on budget period
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} organizationId - Organization ID
 * @param {String} budgetPeriod - "weekly", "monthly", or "yearly"
 * @returns {Promise<Number>} - Total expenses for the period
 */
export const calculateExpenseForPeriod = async (userId, organizationId, budgetPeriod = "monthly") => {
  const now = new Date();
  const startDate = new Date();

  // Set start date based on budget period
  switch (budgetPeriod) {
    case "weekly":
      // Start of current week (Monday)
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate.setDate(diff);
      break;
    case "yearly":
      // Start of current year
      startDate.setMonth(0, 1);
      break;
    case "monthly":
    default:
      // Start of current month
      startDate.setDate(1);
  }

  startDate.setHours(0, 0, 0, 0);

  // ✅ Aggregate expenses for the period
  const result = await Transaction.aggregate([
    {
      $match: {
        userId,
        organizationId,
        type: "expense",
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$amount" }
      }
    }
  ]);

  return result[0]?.totalExpense || 0;
};

/**
 * Get budget status for a user
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} organizationId - Organization ID
 * @returns {Promise<Object>} - Budget status object
 */
export const getBudgetStatus = async (userId, organizationId) => {
  try {
    // ✅ Get user details
    const user = await User.findById(userId);
    if (!user) {
      return {
        status: "ERROR",
        message: "User not found",
        alert: true
      };
    }

    // ✅ If user has no budget, return OK
    if (!user.budget || user.budget <= 0) {
      return {
        status: "OK",
        message: "No budget set",
        budget: null,
        spent: 0,
        remaining: 0,
        percentage: 0,
        alert: false,
        budgetPeriod: user.budgetPeriod
      };
    }

    // ✅ Calculate expenses for the current period
    const spent = await calculateExpenseForPeriod(
      userId,
      organizationId,
      user.budgetPeriod
    );

    const remaining = user.budget - spent;
    const percentage = Math.round((spent / user.budget) * 10000) / 100;

    // ✅ Determine status
    let status = "OK";
    let alert = false;

    if (spent > user.budget) {
      status = "EXCEEDED";
      alert = true;
    } else if (percentage >= 80) {
      // Alert if 80% or more of budget is used
      status = "OK";
      alert = true;
    }

    return {
      status,
      message: status === "EXCEEDED" ? "Budget exceeded!" : `${percentage}% of budget used`,
      budget: Math.round(user.budget * 100) / 100,
      spent: Math.round(spent * 100) / 100,
      remaining: Math.round(remaining * 100) / 100,
      percentage,
      alert,
      budgetPeriod: user.budgetPeriod,
      warningThreshold: 80
    };
  } catch (error) {
    console.error("Error calculating budget status:", error);
    return {
      status: "ERROR",
      message: "Error calculating budget status",
      alert: true
    };
  }
};

/**
 * Get budget status for multiple users
 * @param {Array} userIds - Array of User IDs
 * @param {ObjectId} organizationId - Organization ID
 * @returns {Promise<Array>} - Array of budget status objects
 */
export const getBudgetStatusForUsers = async (userIds, organizationId) => {
  const budgetStatuses = await Promise.all(
    userIds.map(userId => getBudgetStatus(userId, organizationId))
  );
  return budgetStatuses;
};

/**
 * Check if adding a transaction would exceed budget
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} organizationId - Organization ID
 * @param {Number} transactionAmount - Amount of new transaction
 * @returns {Promise<Object>} - Budget validation object
 */
export const validateBudgetForTransaction = async (userId, organizationId, transactionAmount) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.budget || user.budget <= 0) {
      return {
        valid: true,
        message: "No budget constraint",
        wouldExceed: false
      };
    }

    const currentSpent = await calculateExpenseForPeriod(
      userId,
      organizationId,
      user.budgetPeriod
    );

    const newTotal = currentSpent + transactionAmount;
    const wouldExceed = newTotal > user.budget;

    return {
      valid: !wouldExceed,
      message: wouldExceed 
        ? `Adding $${transactionAmount} would exceed budget by $${Math.round((newTotal - user.budget) * 100) / 100}`
        : `OK - $${Math.round((user.budget - newTotal) * 100) / 100} remaining`,
      wouldExceed,
      currentSpent: Math.round(currentSpent * 100) / 100,
      newTotal: Math.round(newTotal * 100) / 100,
      budget: Math.round(user.budget * 100) / 100,
      budgetRemaining: Math.round(Math.max(0, user.budget - newTotal) * 100) / 100
    };
  } catch (error) {
    console.error("Error validating budget for transaction:", error);
    return {
      valid: false,
      message: "Error validating budget",
      wouldExceed: false
    };
  }
};
