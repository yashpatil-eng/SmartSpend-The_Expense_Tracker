import { parse } from "json2csv";
import ExcelJS from "exceljs";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// Helper function to format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

// Helper function to prepare transaction data for export
const prepareTransactionData = (transactions) => {
  return transactions.map((t) => ({
    "User Name": t.userId.name,
    "Email": t.userId.email,
    "Amount": t.amount,
    "Type": t.type.toUpperCase(),
    "Category": t.category,
    "Date": formatDate(t.date),
    "Notes": t.notes,
    "Items Count": t.items?.length || 0
  }));
};

// Export organization transactions as CSV
export const exportTransactionsCSV = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Only ORG_ADMIN can export data" });
    }

    const { startDate, endDate, userId, category } = req.query;
    const filter = { organizationId: req.user.organizationId };

    if (userId) {
      const targetUser = await User.findById(userId);
      if (!targetUser || targetUser.organizationId.toString() !== req.user.organizationId.toString()) {
        return res.status(403).json({ message: "User not found in organization" });
      }
      filter.userId = userId;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(filter)
      .populate("userId", "name email")
      .sort({ date: -1 });

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for export" });
    }

    const data = prepareTransactionData(transactions);
    const csv = parse(data);

    res.header("Content-Type", "text/csv");
    res.header("Content-Disposition", `attachment; filename="transactions-${new Date().getTime()}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error("Export CSV error:", error);
    res.status(500).json({ message: "Error exporting to CSV" });
  }
};

// Export organization transactions as Excel
export const exportTransactionsExcel = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Only ORG_ADMIN can export data" });
    }

    const { startDate, endDate, userId, category } = req.query;
    const filter = { organizationId: req.user.organizationId };

    if (userId) {
      const targetUser = await User.findById(userId);
      if (!targetUser || targetUser.organizationId.toString() !== req.user.organizationId.toString()) {
        return res.status(403).json({ message: "User not found in organization" });
      }
      filter.userId = userId;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(filter)
      .populate("userId", "name email budget")
      .sort({ date: -1 });

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for export" });
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    // Add headers
    worksheet.columns = [
      { header: "User Name", key: "userName", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Amount", key: "amount", width: 12 },
      { header: "Type", key: "type", width: 10 },
      { header: "Category", key: "category", width: 15 },
      { header: "Date", key: "date", width: 12 },
      { header: "Notes", key: "notes", width: 30 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF366092" }
    };

    // Add data rows
    transactions.forEach((transaction) => {
      worksheet.addRow({
        userName: transaction.userId.name,
        email: transaction.userId.email,
        amount: transaction.amount,
        type: transaction.type.toUpperCase(),
        category: transaction.category,
        date: formatDate(transaction.date),
        notes: transaction.notes
      });
    });

    // Add summary sheet
    const summarySheet = workbook.addWorksheet("Summary");

    // Calculate summary data
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const net = totalIncome - totalExpenses;

    // Add summary data
    summarySheet.addRow(["Metric", "Value"]);
    summarySheet.addRow(["Total Expenses", totalExpenses]);
    summarySheet.addRow(["Total Income", totalIncome]);
    summarySheet.addRow(["Net", net]);
    summarySheet.addRow(["Total Transactions", transactions.length]);

    // Style summary header
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.columns = [
      { width: 20 },
      { width: 15 }
    ];

    // Generate and send file
    const filename = `transactions-${new Date().getTime()}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Excel error:", error);
    res.status(500).json({ message: "Error exporting to Excel" });
  }
};
