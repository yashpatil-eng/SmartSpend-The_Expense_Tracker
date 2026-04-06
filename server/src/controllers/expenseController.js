import Expense from "../models/Expense.js";

export const createExpense = async (req, res) => {
  const { amount, category, date, note } = req.body;
  if (amount === undefined || !category || !date) {
    return res.status(400).json({ message: "Amount, category and date are required" });
  }

  const expense = await Expense.create({
    userId: req.user._id,
    amount,
    category,
    date,
    note: note || ""
  });

  return res.status(201).json(expense);
};

export const getExpenses = async (req, res) => {
  const { category, startDate, endDate } = req.query;
  const query = { userId: req.user._id };

  if (category) query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const expenses = await Expense.find(query).sort({ date: -1 });
  return res.json(expenses);
};

export const updateExpense = async (req, res) => {
  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ message: "Expense not found" });
  }
  return res.json(updated);
};

export const deleteExpense = async (req, res) => {
  const deleted = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!deleted) {
    return res.status(404).json({ message: "Expense not found" });
  }
  return res.json({ message: "Expense deleted successfully" });
};
