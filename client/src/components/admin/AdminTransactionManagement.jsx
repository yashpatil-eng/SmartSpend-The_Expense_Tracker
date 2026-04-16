import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Trash2 } from "lucide-react";

const AdminTransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/transactions");
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/admin/transactions/${transactionId}`);
        setTransactions(transactions.filter((t) => t._id !== transactionId));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete transaction");
      }
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesType = filterType === "all" || txn.type === filterType;
    const matchesCategory = filterCategory === "all" || txn.category === filterCategory;
    return matchesType && matchesCategory;
  });

  const categories = [...new Set(transactions.map((t) => t.category))];

  if (loading) {
    return <div className="p-6 text-center">Loading transactions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transaction Management</h1>
        <p className="text-gray-400">Total transactions: {transactions.length}</p>
      </div>

      {/* Filters */}
      <div className="surface-card p-4 rounded-lg flex gap-4 flex-wrap">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="field-input"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="field-input"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button onClick={fetchTransactions} className="btn-secondary">
          Refresh
        </button>
      </div>

      {error && <div className="p-4 bg-red-900 text-red-200 rounded">Error: {error}</div>}

      {/* Transactions Table */}
      <div className="surface-card p-6 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-right py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Notes</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{txn.userId?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-400">{txn.userId?.email}</div>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium">{txn.category}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      txn.type === "income"
                        ? "bg-green-900 text-green-200"
                        : "bg-red-900 text-red-200"
                    }`}
                  >
                    {txn.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-semibold">₹{txn.amount.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm text-gray-400 max-w-xs truncate">
                  {txn.notes || "-"}
                </td>
                <td className="py-3 px-4 text-sm">
                  {new Date(txn.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDeleteTransaction(txn._id)}
                    className="text-red-400 hover:text-red-300 transition"
                    title="Delete transaction"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center text-gray-400 py-8">No transactions found</div>
      )}
    </div>
  );
};

export default AdminTransactionManagement;
