import { useMemo, useState } from "react";

const MiniCalculator = () => {
  const [dailyExpense, setDailyExpense] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const daily = Number(dailyExpense || 0);
  const monthlyEstimate = useMemo(() => daily * 30, [daily]);
  const yearlyEstimate = useMemo(() => monthlyEstimate * 12, [monthlyEstimate]);
  const weeklyEstimate = useMemo(() => daily * 7, [daily]);
  const budgetGap = useMemo(() => Number(monthlyBudget || 0) - monthlyEstimate, [monthlyBudget, monthlyEstimate]);

  return (
    <div className="surface-card p-4">
      <h3 className="text-lg font-semibold">Mini Expense Calculator</h3>
      <p className="mb-3 text-sm text-gray-400">Estimate your monthly spending from daily costs.</p>
      <input
        type="number"
        min="0"
        placeholder="Daily expense"
        value={dailyExpense}
        onChange={(e) => setDailyExpense(e.target.value)}
        className="field-input"
      />
      <input
        type="number"
        min="0"
        placeholder="Optional monthly budget"
        value={monthlyBudget}
        onChange={(e) => setMonthlyBudget(e.target.value)}
        className="field-input mt-2"
      />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-2">
          <p className="text-gray-400">Weekly</p>
          <p className="font-semibold text-white">Rs. {weeklyEstimate}</p>
        </div>
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-2">
          <p className="text-gray-400">Monthly</p>
          <p className="font-semibold text-white">Rs. {monthlyEstimate}</p>
        </div>
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-2">
          <p className="text-gray-400">Yearly</p>
          <p className="font-semibold text-white">Rs. {yearlyEstimate}</p>
        </div>
      </div>
      {monthlyBudget ? (
        <p className={`mt-3 text-sm font-medium ${budgetGap >= 0 ? "text-white" : "text-red-400"}`}>
          {budgetGap >= 0
            ? `Great! You can still save Rs. ${budgetGap} this month.`
            : `You may exceed budget by Rs. ${Math.abs(budgetGap)}. Reduce non-essential spending.`}
        </p>
      ) : null}
    </div>
  );
};

export default MiniCalculator;
