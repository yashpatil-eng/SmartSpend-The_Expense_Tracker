import Expense from "../models/Expense.js";
import Profile from "../models/Profile.js";
import { generateInsights } from "../services/insightsService.js";

export const getDashboardSummary = async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [profile, monthlyExpenses, categoryAgg, monthlyTrendAgg] = await Promise.all([
    Profile.findOne({ userId }),
    Expense.find({ userId, date: { $gte: monthStart, $lte: monthEnd } }),
    Expense.aggregate([
      { $match: { userId, date: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $project: { _id: 0, category: "$_id", total: 1 } }
    ]),
    Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])
  ]);

  const income = profile?.income || 0;
  const savingsGoal = profile?.savingsGoal || 0;
  const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = income - totalExpenses;
  const totalBalance = remainingBudget;

  const monthlyTrend = monthlyTrendAgg.map((entry) => ({
    month: `${entry._id.year}-${String(entry._id.month).padStart(2, "0")}`,
    total: entry.total
  }));

  const insights = generateInsights({
    income,
    savingsGoal,
    totalExpenses,
    categoryTotals: categoryAgg
  });

  return res.json({
    profile,
    metrics: {
      income,
      totalBalance,
      totalExpenses,
      remainingBudget,
      savingsGoal
    },
    categoryBreakdown: categoryAgg,
    monthlyTrend,
    insights
  });
};
