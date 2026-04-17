import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useOrganization } from "../hooks/useOrganization";
import OrganizationSetup from "../components/auth/OrganizationSetup";

const defaultCategories = ["Food", "Travel", "Rent", "Utilities", "Shopping"];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const { organization, fetchMyOrganization } = useOrganization();
  const [step, setStep] = useState("organization"); // "organization" | "profile"
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState(defaultCategories);
  const [form, setForm] = useState({ income: "", savingsGoal: "", spendingHabit: "medium", goal: "saving" });

  const addCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories((prev) => [...prev, trimmed]);
    setCustomCategory("");
  };

  const handleOrgSetupSuccess = async () => {
    // Org setup done, move to profile setup
    await fetchMyOrganization();
    setStep("profile");
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

  if (step === "organization") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to SmartSpend! 🎉</h1>
            <p className="text-gray-400">Let's set up your account in a few quick steps</p>
          </div>
          <OrganizationSetup onSuccess={handleOrgSetupSuccess} showSkip={true} />
          <p className="text-center text-xs text-gray-500 mt-6">
            Step 1 of 2: Organization Setup
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card mx-auto mt-8 max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Set up your financial profile</h1>
        <p className="mb-4 text-sm text-gray-400">This helps SmartSpend personalize your dashboard and suggestions.</p>
        {organization && (
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-blue-400">
              ✓ Organization Setup Complete: <strong>{organization.name}</strong>
            </p>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <input className="field-input" type="number" min="0" placeholder="Monthly Income" value={form.income} onChange={(e) => setForm((p) => ({ ...p, income: e.target.value }))} required />
        <input className="field-input" type="number" min="0" placeholder="Savings Goal" value={form.savingsGoal} onChange={(e) => setForm((p) => ({ ...p, savingsGoal: e.target.value }))} required />
        <select className="field-input" value={form.spendingHabit} onChange={(e) => setForm((p) => ({ ...p, spendingHabit: e.target.value }))}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select className="field-input" value={form.goal} onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value }))}>
          <option value="saving">Saving</option>
          <option value="investment">Investment</option>
          <option value="control spending">Control Spending</option>
        </select>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-gray-400">Expense Categories</label>
          <div className="mb-2 flex gap-2">
            <input className="field-input" placeholder="Add custom category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
            <button type="button" className="btn-secondary" onClick={addCategory}>Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat} className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-white">{cat}</span>
            ))}
          </div>
        </div>
        <button className="btn-primary md:col-span-2">Complete Onboarding</button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-6">
        Step 2 of 2: Profile Setup
      </p>
    </div>
  );
};

export default OnboardingPage;
