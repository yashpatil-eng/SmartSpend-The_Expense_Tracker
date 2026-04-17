import { useEffect, useState } from "react";
import TransactionForm from "../components/dashboard/TransactionForm";
import TransactionList from "../components/dashboard/TransactionList";
import CategoryPieChart from "../components/CategoryPieChart";
import MonthlyBarChart from "../components/MonthlyBarChart";
import LoadingSpinner from "../components/auth/LoadingSpinner";
import JoinOrganizationSection from "../components/dashboard/JoinOrganizationSection";
import OrganizationPanel from "../components/dashboard/OrganizationPanel";
import { formatCurrency } from "../utils/format";
import { buildFilterParams } from "../utils/transactionUtils";
import { useAuth } from "../hooks/useAuth";
import { useOrganization } from "../hooks/useOrganization";
import {
  fetchTransactions,
  createTransaction,
  removeTransaction,
  fetchChartData
} from "../services/transactionService";

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const { fetchMyOrganization } = useOrganization();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalBalance: 0, totalIncome: 0, totalExpense: 0 });
  const [charts, setCharts] = useState({ monthlyExpenses: [], categorySpending: [] });
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    type: ""
  });

  const loadDashboard = async () => {
    setError("");
    setLoading(true);
    try {
      // Load organization data first
      await fetchMyOrganization();

      const params = buildFilterParams(filters);
      const [transactionsRes, chartRes] = await Promise.all([
        fetchTransactions(params),
        fetchChartData(buildFilterParams({
          startDate: filters.startDate,
          endDate: filters.endDate,
          category: filters.category
        }))
      ]);

      setTransactions(transactionsRes.data.transactions || []);
      setSummary(transactionsRes.data.summary || { totalBalance: 0, totalIncome: 0, totalExpense: 0 });
      setCharts(chartRes.data || { monthlyExpenses: [], categorySpending: [] });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAdd = async (formData) => {
    setError("");
    try {
      setSubmitting(true);
      const response = await createTransaction(formData);
      
      // ✅ Return response so TransactionForm can handle success message
      setMessage(response.data?.message || "Transaction added successfully.");
      setFormOpen(false);
      await loadDashboard();
      
      // ✅ Return response for form to display remaining amount info
      return response.data;
    } catch (err) {
      // ✅ Throw error so TransactionForm can catch and display
      const errorMessage = err.response?.data?.message || "Unable to add transaction.";
      setError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      setDeletingId(id);
      await removeTransaction(id);
      setMessage("Transaction deleted successfully.");
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete transaction.");
    } finally {
      setDeletingId("");
    }
  };

  const handleFilterApply = async () => {
    await loadDashboard();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      {(message || error) && (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{message || error}</span>
            <button type="button" onClick={() => { setMessage(""); setError(""); }} className="text-gray-400 hover:text-white">Close</button>
          </div>
        </div>
      )}

      <JoinOrganizationSection user={user} onJoinSuccess={refreshUser} />

      <OrganizationPanel />

      <div className="surface-card p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Transaction Filters</h2>
            <p className="text-sm text-gray-400">Narrow results by date, category, or type.</p>
          </div>
          <button className="btn-primary w-full md:w-auto" onClick={handleFilterApply} disabled={loading}>
            {loading ? <LoadingSpinner /> : "Apply Filters"}
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <input
            className="field-input"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
          />
          <input
            className="field-input"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
          />
          <input
            className="field-input"
            placeholder="Category"
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          />
          <select
            className="field-input"
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-4">
          <p className="text-sm text-gray-400">Total Balance</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(summary.totalBalance)}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-sm text-gray-400">Total Income</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(summary.totalIncome)}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-sm text-gray-400">Total Expense</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(summary.totalExpense)}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CategoryPieChart data={charts.categorySpending} />
        <MonthlyBarChart data={charts.monthlyExpenses} />
      </div>

      <div className="surface-card p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Transactions</h2>
            <p className="text-sm text-gray-400">Latest transactions matching the selected filters.</p>
          </div>
          <button type="button" className="btn-primary" onClick={() => setFormOpen(true)}>
            Add Transaction
          </button>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <LoadingSpinner /> Loading transactions...
          </div>
        ) : (
          <TransactionList transactions={transactions} onDelete={handleDelete} deletingId={deletingId} />
        )}
      </div>

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
        loading={submitting}
      />
    </div>
  );
};

export default Dashboard;
