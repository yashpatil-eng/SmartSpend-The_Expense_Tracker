import { useState, useEffect } from "react";
import api from "../../api/axios";
import StatCard from "../StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/stats");
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stats");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="p-6 text-center">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">System overview and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" />
        <StatCard title="Active Users" value={stats.activeUsers} icon="✓" />
        <StatCard title="Total Admins" value={stats.totalAdmins} icon="⚙️" />
        <StatCard title="Transactions" value={stats.totalTransactions} icon="📊" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Income" value={`₹${stats.totalIncome.toFixed(2)}`} icon="📈" />
        <StatCard title="Total Expenses" value={`₹${stats.totalExpenses.toFixed(2)}`} icon="📉" />
        <StatCard title="Net Balance" value={`₹${stats.netBalance.toFixed(2)}`} icon="💰" />
      </div>

      {/* Admin Management Link */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Manage Admin Accounts</h3>
            <p className="text-sm text-zinc-400">Create or remove admin accounts, view all admins</p>
          </div>
          <div className="text-sm font-medium text-zinc-300 bg-zinc-800 rounded-lg px-4 py-2">
            Use sidebar menu →
          </div>
        </div>
      </div>

      {/* Category Breakdown Chart */}
      {stats.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
        <div className="surface-card p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Transactions by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#9b59b6" name="Amount" radius={[8, 8, 0, 0]} />
              <Bar dataKey="count" fill="#1abc9c" name="Count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Category Breakdown Chart */}
      {stats.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
        <div className="surface-card p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Transactions by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#9b59b6" name="Amount" radius={[8, 8, 0, 0]} />
              <Bar dataKey="count" fill="#1abc9c" name="Count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Recent Transactions */}
      {stats.recentTransactions && stats.recentTransactions.length > 0 && (
        <div className="surface-card p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-700">
                <tr>
                  <th className="text-left py-2 px-4">User</th>
                  <th className="text-left py-2 px-4">Category</th>
                  <th className="text-left py-2 px-4">Type</th>
                  <th className="text-right py-2 px-4">Amount</th>
                  <th className="text-left py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((txn) => (
                  <tr key={txn._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="py-3 px-4">{txn.userId?.name || "Unknown"}</td>
                    <td className="py-3 px-4">{txn.category}</td>
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
                    <td className="py-3 px-4">{new Date(txn.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
