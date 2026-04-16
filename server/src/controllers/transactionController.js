import Transaction from "../models/Transaction.js";
import { buildTransactionQuery, summarizeTransactions } from "../utils/transactionHelpers.js";

const normalizeItems = (items) => {
  if (!items) return [];
  let parsed = items;
  if (typeof items === "string") {
    try {
      parsed = JSON.parse(items);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((item) => item?.name && Number(item?.price) >= 0)
    .map((item) => ({ name: String(item.name).trim(), price: Number(item.price) }));
};

// ✅ Helper function to create transaction with remaining amount logic
const createTransactionWithRemaining = async (userId, transactionData) => {
  const { amount, type, category, notes, date, items, billImage } = transactionData;

  // Calculate items total (breakdown)
  const itemsTotal = items.length
    ? items.reduce((sum, item) => sum + Number(item.price), 0)
    : 0;

  // Calculate remaining amount
  const remainingAmount = Number(amount) - itemsTotal;

  // Create main transaction
  const mainTransaction = await Transaction.create({
    userId,
    amount: Number(amount),
    type,
    category,
    notes,
    items,
    billImage,
    date: new Date(date)
  });

  let remainingTransaction = null;
  let message = "Transaction added successfully";

  // ✅ Create remaining transaction if remaining > 0
  if (remainingAmount > 0) {
    remainingTransaction = await Transaction.create({
      userId,
      amount: remainingAmount,
      type,
      category: "Other",
      notes: "Auto-generated remaining amount",
      items: [],
      billImage: "",
      date: new Date(date)
    });

    message = `Transaction added successfully. Remaining amount ₹${remainingAmount.toFixed(2)} added as 'Other'`;
  }

  return {
    mainTransaction,
    remainingTransaction,
    message
  };
};

export const addTransaction = async (req, res) => {
  const { amount, type, category, notes, date } = req.body;
  
  // ✅ Validation
  if (!amount || !type || !category || !date) {
    return res.status(400).json({ message: "Amount, type, category and date are required" });
  }
  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "Transaction type must be income or expense" });
  }

  const mainAmount = Number(amount);
  if (mainAmount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  const items = normalizeItems(req.body.items);
  const itemsTotal = items.length
    ? items.reduce((sum, item) => sum + Number(item.price), 0)
    : 0;

  // ✅ Validation: Items cannot exceed amount
  if (itemsTotal > mainAmount) {
    return res.status(400).json({ message: "Items total cannot exceed the main amount" });
  }

  try {
    const result = await createTransactionWithRemaining(req.user._id, {
      amount: mainAmount,
      type,
      category,
      notes: notes || "",
      items,
      billImage: req.file ? `/uploads/${req.file.filename}` : "",
      date
    });

    return res.status(201).json({
      success: true,
      mainTransaction: result.mainTransaction,
      remainingTransaction: result.remainingTransaction,
      message: result.message
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating transaction", error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  const { startDate, endDate, category, type, page, limit } = req.query;
  const query = buildTransactionQuery({
    userId: req.user._id,
    startDate,
    endDate,
    category,
    type
  });

  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(0, Number(limit) || 0);

  const allMatchingTransactions = await Transaction.find(query);
  const totals = summarizeTransactions(allMatchingTransactions);

  const transactionQuery = Transaction.find(query).sort({ date: -1, createdAt: -1 });
  if (pageSize > 0) {
    transactionQuery.skip((pageNumber - 1) * pageSize).limit(pageSize);
  }

  const transactions = await transactionQuery;

  return res.json({
    transactions,
    summary: {
      ...totals,
      totalBalance: totals.totalIncome - totals.totalExpense,
      page: pageNumber,
      limit: pageSize,
      count: transactions.length
    }
  });
};

export const deleteTransaction = async (req, res) => {
  const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!deleted) {
    return res.status(404).json({ message: "Transaction not found" });
  }
  return res.json({ message: "Transaction deleted successfully" });
};

export const exportTransactions = async (req, res) => {
  const format = (req.query.format || "json").toLowerCase();
  const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });

  if (format === "csv") {
    const header = "amount,type,category,notes,date,tags\n";
    const rows = transactions
      .map((tx) =>
        [
          tx.amount,
          tx.type,
          `"${(tx.category || "").replace(/"/g, '""')}"`,
          `"${(tx.notes || "").replace(/"/g, '""')}"`,
          tx.date.toISOString(),
          `"${(tx.tags || []).join("|")}"`
        ].join(",")
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
    return res.send(`${header}${rows}`);
  }

  return res.json({ transactions });
};

export const importTransactions = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Import file is required" });

  const content = req.file.buffer.toString("utf-8");
  let parsed = [];
  if (req.file.mimetype.includes("json") || req.file.originalname.endsWith(".json")) {
    const json = JSON.parse(content);
    parsed = Array.isArray(json) ? json : json.transactions || [];
  } else {
    const [headerLine, ...lines] = content.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(",").map((h) => h.trim());
    parsed = lines.map((line) => {
      const cols = line.split(",");
      const entry = {};
      headers.forEach((h, idx) => {
        entry[h] = (cols[idx] || "").replace(/^"|"$/g, "");
      });
      return entry;
    });
  }

  const docs = parsed
    .filter((item) => item.amount && item.type && item.category && item.date)
    .map((item) => ({
      userId: req.user._id,
      amount: Number(item.amount),
      type: item.type,
      category: item.category,
      notes: item.notes || "",
      date: new Date(item.date),
      tags: Array.isArray(item.tags) ? item.tags : String(item.tags || "").split("|").filter(Boolean)
    }));

  if (!docs.length) return res.status(400).json({ message: "No valid transactions found in file" });
  await Transaction.insertMany(docs);
  return res.json({ message: `Imported ${docs.length} transactions successfully` });
};
