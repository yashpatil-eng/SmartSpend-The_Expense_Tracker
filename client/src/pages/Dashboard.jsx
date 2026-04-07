import { useEffect, useState } from "react";
import api from "../api/axios";
import TransactionForm from "../components/dashboard/TransactionForm";
import TransactionList from "../components/dashboard/TransactionList";
import { formatCurrency } from "../utils/format";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalBalance: 0, totalIncome: 0, totalExpense: 0 });
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");

  const fetchTransactions = async () => {
    const { data } = await api.get("/transactions");
    setTransactions(data.transactions || []);
    setSummary(data.summary || { totalBalance: 0, totalIncome: 0, totalExpense: 0 });
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchTransactions();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAdd = async (formData) => {
    try {
      setSubmitting(true);
      await api.post("/transactions/add", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage("Transaction added successfully.");
      setFormOpen(false);
      await fetchTransactions();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await api.delete(`/transactions/${id}`);
      setMessage("Transaction deleted successfully.");
      await fetchTransactions();
    } finally {
      setDeletingId("");
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      {message ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white">
          <div className="flex items-center justify-between gap-3">
            <span>{message}</span>
            <button type="button" onClick={() => setMessage("")} className="text-gray-400 hover:text-white">Close</button>
          </div>
        </div>
      ) : null}

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

      <div className="surface-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Transactions</h2>
          <button type="button" className="btn-primary" onClick={() => setFormOpen(true)}>
            Add Transaction
          </button>
        </div>
        <TransactionList transactions={transactions} onDelete={handleDelete} deletingId={deletingId} />
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
