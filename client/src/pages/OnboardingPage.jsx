import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const defaultCategories = ["Food", "Travel", "Rent", "Utilities", "Shopping"];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState(defaultCategories);
  const [form, setForm] = useState({ income: "", savingsGoal: "", spendingHabit: "medium", goal: "saving" });

  const addCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories((prev) => [...prev, trimmed]);
    setCustomCategory("");
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/profile", {
      income: Number(form.income),
      savingsGoal: Number(form.savingsGoal),
      categories,
      spendingHabit: form.spendingHabit,
      goal: form.goal
    });
    await refreshUser();
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-xl border bg-white p-6">
      <h1 className="mb-2 text-2xl font-bold">Set up your financial profile</h1>
      <p className="mb-4 text-sm text-slate-500">This helps SmartSpend personalize your dashboard and suggestions.</p>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <input className="rounded-lg border px-3 py-2" type="number" min="0" placeholder="Monthly Income" value={form.income} onChange={(e) => setForm((p) => ({ ...p, income: e.target.value }))} required />
        <input className="rounded-lg border px-3 py-2" type="number" min="0" placeholder="Savings Goal" value={form.savingsGoal} onChange={(e) => setForm((p) => ({ ...p, savingsGoal: e.target.value }))} required />
        <select className="rounded-lg border px-3 py-2" value={form.spendingHabit} onChange={(e) => setForm((p) => ({ ...p, spendingHabit: e.target.value }))}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select className="rounded-lg border px-3 py-2" value={form.goal} onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value }))}>
          <option value="saving">Saving</option>
          <option value="investment">Investment</option>
          <option value="control spending">Control Spending</option>
        </select>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm">Expense Categories</label>
          <div className="mb-2 flex gap-2">
            <input className="w-full rounded-lg border px-3 py-2" placeholder="Add custom category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
            <button type="button" className="rounded-lg border px-3" onClick={addCategory}>Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat} className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-700">{cat}</span>
            ))}
          </div>
        </div>
        <button className="md:col-span-2 rounded-lg bg-indigo-600 py-2 text-white">Complete Onboarding</button>
      </form>
    </div>
  );
};

export default OnboardingPage;
