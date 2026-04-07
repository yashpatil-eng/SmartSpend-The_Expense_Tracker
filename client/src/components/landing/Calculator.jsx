import { useMemo, useState } from "react";

const Calculator = () => {
  const [dailyExpense, setDailyExpense] = useState("");
  const monthlyExpense = useMemo(() => Number(dailyExpense || 0) * 30, [dailyExpense]);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <div className="surface-card p-6">
        <h2 className="text-2xl font-bold text-white">Mini Calculator</h2>
        <p className="mt-1 text-sm text-gray-400">Quickly estimate your monthly spending from daily expense.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            type="number"
            min="0"
            value={dailyExpense}
            onChange={(e) => setDailyExpense(e.target.value)}
            placeholder="Enter daily expense"
            className="field-input"
          />
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3">
            <p className="text-sm text-gray-400">Monthly Expense</p>
            <p className="mt-1 text-xl font-bold text-white">Rs. {monthlyExpense}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
