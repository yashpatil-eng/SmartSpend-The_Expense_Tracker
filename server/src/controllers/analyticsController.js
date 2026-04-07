import Transaction from "../models/Transaction.js";

const toDate = (value, fallback) => (value ? new Date(value) : fallback);

export const getAnalyticsSummary = async (req, res) => {
  const start = toDate(req.query.startDate, new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const end = toDate(req.query.endDate, new Date());
  const category = req.query.category;

  const query = { userId: req.user._id, date: { $gte: start, $lte: end } };
  if (category) query.category = category;
  const transactions = await Transaction.find(query);

  const expenses = transactions.filter((tx) => tx.type === "expense");
  const totalSpent = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const categoryMap = expenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
  const highestCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const avgDailyExpense = totalSpent / days;

  return res.json({ totalSpent, highestCategory, avgDailyExpense });
};

export const getAnalyticsCharts = async (req, res) => {
  const start = toDate(req.query.startDate, new Date(new Date().getFullYear(), 0, 1));
  const end = toDate(req.query.endDate, new Date());
  const query = { userId: req.user._id, date: { $gte: start, $lte: end } };
  if (req.query.category) query.category = req.query.category;
  const transactions = await Transaction.find(query);

  const monthlyMap = {};
  const categoryMap = {};
  const incomeExpenseMap = {};

  transactions.forEach((tx) => {
    const month = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyMap[month]) monthlyMap[month] = 0;
    if (tx.type === "expense") monthlyMap[month] += tx.amount;

    if (tx.type === "expense") {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    }

    if (!incomeExpenseMap[month]) incomeExpenseMap[month] = { income: 0, expense: 0 };
    incomeExpenseMap[month][tx.type] += tx.amount;
  });

  return res.json({
    monthlyExpenses: Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount })),
    categorySpending: Object.entries(categoryMap).map(([category, amount]) => ({ category, amount })),
    incomeVsExpense: Object.entries(incomeExpenseMap).map(([month, values]) => ({ month, ...values }))
  });
};
