export const buildTransactionQuery = ({ userId, startDate, endDate, category, type }) => {
  const query = { userId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.date.$lte = end;
    }
  }

  if (category) query.category = category;
  if (type && ["income", "expense"].includes(type)) query.type = type;
  return query;
};

export const summarizeTransactions = (transactions) =>
  transactions.reduce(
    (acc, tx) => {
      if (tx.type === "income") acc.totalIncome += tx.amount;
      if (tx.type === "expense") acc.totalExpense += tx.amount;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );
