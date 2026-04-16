export const buildFilterParams = (filters) =>
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

export const calculateSummary = (transactions) =>
  transactions.reduce(
    (acc, tx) => {
      if (tx.type === "income") acc.totalIncome += tx.amount;
      if (tx.type === "expense") acc.totalExpense += tx.amount;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, totalBalance: 0 }
  );
