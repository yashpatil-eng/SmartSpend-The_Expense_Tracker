export const generateInsights = ({ income, savingsGoal, totalExpenses, categoryTotals }) => {
  const suggestions = [];
  const remainingBudget = income - totalExpenses;

  if (totalExpenses > income) {
    suggestions.push("You are overspending compared to your income. Reduce non-essential costs immediately.");
  } else if (totalExpenses > income * 0.8) {
    suggestions.push("Your spending is above 80% of your income. Consider tightening this month's budget.");
  } else {
    suggestions.push("Great job! Your spending is within a healthy range.");
  }

  const sortedCategories = [...categoryTotals].sort((a, b) => b.total - a.total);
  if (sortedCategories.length > 0) {
    const top = sortedCategories[0];
    suggestions.push(`You are spending the most on ${top.category}. Try reducing it by 10% next month.`);
  }

  if (remainingBudget > 0) {
    const possibleSaving = Math.max(0, Math.floor(remainingBudget * 0.5));
    suggestions.push(`You can save approximately Rs. ${possibleSaving} this month if current trend continues.`);
  }

  if (savingsGoal > 0) {
    const progress = Math.min(100, Math.round((Math.max(0, remainingBudget) / savingsGoal) * 100));
    suggestions.push(`Savings goal progress: ${progress}%. Stay consistent with your plan.`);
  }

  return suggestions;
};
