import Transaction from "../models/Transaction.js";

export const getAIInsights = async (req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [current, previous] = await Promise.all([
    Transaction.find({ userId: req.user._id, type: "expense", date: { $gte: monthStart } }),
    Transaction.find({ userId: req.user._id, type: "expense", date: { $gte: prevMonthStart, $lt: monthStart } })
  ]);

  const totalCurrent = current.reduce((sum, tx) => sum + tx.amount, 0);
  const totalPrevious = previous.reduce((sum, tx) => sum + tx.amount, 0);
  const diffPct = totalPrevious > 0 ? Math.round(((totalCurrent - totalPrevious) / totalPrevious) * 100) : 0;

  const categoryTotals = current.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
  const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCategoryEntry?.[0] || "N/A";
  const topCategoryAmount = topCategoryEntry?.[1] || 0;

  const budgetLimit = Math.max(totalPrevious, 1);
  const closeToLimit = totalCurrent > budgetLimit * 0.85;
  const unusual = diffPct > 25;
  const possibleSavings = Math.round(topCategoryAmount * 0.2);

  const insights = [
    `You spend ${Math.abs(diffPct)}% ${diffPct >= 0 ? "more" : "less"} this month compared to last month.`,
    `Highest spending category is ${topCategory}.`,
    `Set a budget cap near Rs. ${Math.round(totalCurrent * 1.1)} based on your current pattern.`,
    closeToLimit ? "You are close to your monthly limit." : "Your spending is within a safe monthly limit.",
    unusual ? "Unusual high spending detected this month." : "No unusual high-spending spikes detected.",
    `Reduce ${topCategory} expenses to potentially save Rs. ${possibleSavings}/month.`
  ];

  return res.json({ insights });
};
