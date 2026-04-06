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
    <div className="rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-lg font-semibold">Mini Expense Calculator</h3>
      <p className="mb-3 text-sm text-slate-500">Estimate your monthly spending from daily costs.</p>
      <input
        type="number"
        min="0"
        placeholder="Daily expense"
        value={dailyExpense}
        onChange={(e) => setDailyExpense(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />
      <input
        type="number"
        min="0"
        placeholder="Optional monthly budget"
        value={monthlyBudget}
        onChange={(e) => setMonthlyBudget(e.target.value)}
        className="mt-2 w-full rounded-lg border px-3 py-2"
      />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-slate-100 p-2">
          <p className="text-slate-500">Weekly</p>
          <p className="font-semibold text-slate-800">Rs. {weeklyEstimate}</p>
        </div>
        <div className="rounded-lg bg-indigo-50 p-2">
          <p className="text-slate-500">Monthly</p>
          <p className="font-semibold text-indigo-700">Rs. {monthlyEstimate}</p>
        </div>
        <div className="rounded-lg bg-slate-100 p-2">
          <p className="text-slate-500">Yearly</p>
          <p className="font-semibold text-slate-800">Rs. {yearlyEstimate}</p>
        </div>
      </div>
      {monthlyBudget ? (
        <p className={`mt-3 text-sm font-medium ${budgetGap >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
          {budgetGap >= 0
            ? `Great! You can still save Rs. ${budgetGap} this month.`
            : `You may exceed budget by Rs. ${Math.abs(budgetGap)}. Reduce non-essential spending.`}
        </p>
      ) : null}
    </div>
  );
};

export default MiniCalculator;
