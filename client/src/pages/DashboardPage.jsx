import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import CategoryPieChart from "../components/CategoryPieChart";
import ExpenseFormModal from "../components/ExpenseFormModal";
import ExpenseTable from "../components/ExpenseTable";
import InsightsPanel from "../components/InsightsPanel";
import StatCard from "../components/StatCard";
import TrendLineChart from "../components/TrendLineChart";
import { formatCurrency } from "../utils/format";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ category: "", startDate: "", endDate: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const categories = useMemo(() => summary?.profile?.categories || ["Food", "Travel", "Rent"], [summary]);

  const fetchSummary = async () => {
    const { data } = await api.get("/dashboard/summary");
    setSummary(data);
  };

  const fetchExpenses = async () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const { data } = await api.get("/expenses", { params });
    setExpenses(data);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleSaveExpense = async (payload) => {
    if (editingExpense) {
      await api.put(`/expenses/${editingExpense._id}`, payload);
    } else {
      await api.post("/expenses", payload);
    }
    setModalOpen(false);
    setEditingExpense(null);
    await Promise.all([fetchSummary(), fetchExpenses()]);
  };

  const handleDeleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    await Promise.all([fetchSummary(), fetchExpenses()]);
  };

  if (!summary) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Balance" value={formatCurrency(summary.metrics.totalBalance)} accent="indigo" />
        <StatCard title="Total Expenses" value={formatCurrency(summary.metrics.totalExpenses)} accent="rose" />
        <StatCard title="Remaining Budget" value={formatCurrency(summary.metrics.remainingBudget)} accent="emerald" />
        <StatCard title="Savings Goal" value={formatCurrency(summary.metrics.savingsGoal)} accent="amber" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CategoryPieChart data={summary.categoryBreakdown} />
        <TrendLineChart data={summary.monthlyTrend} />
      </div>

      <InsightsPanel insights={summary.insights} />

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Expenses</h3>
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-white"
            onClick={() => {
              setEditingExpense(null);
              setModalOpen(true);
            }}
          >
            Add Expense
          </button>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <select className="rounded-lg border px-3 py-2" value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input className="rounded-lg border px-3 py-2" type="date" value={filters.startDate} onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))} />
          <input className="rounded-lg border px-3 py-2" type="date" value={filters.endDate} onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))} />
        </div>

        <ExpenseTable
          expenses={expenses}
          onEdit={(expense) => {
            setEditingExpense(expense);
            setModalOpen(true);
          }}
          onDelete={handleDeleteExpense}
        />
      </div>

      <ExpenseFormModal
        open={modalOpen}
        initialValues={editingExpense}
        categories={categories}
        onClose={() => {
          setModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSaveExpense}
      />
    </div>
  );
};

export default DashboardPage;
