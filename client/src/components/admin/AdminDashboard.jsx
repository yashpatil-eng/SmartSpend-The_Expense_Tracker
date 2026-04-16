import { useState, useEffect } from "react";
import api from "../../api/axios";
import StatCard from "../StatCard";
import CreateAdminForm from "./CreateAdminForm";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);

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

      {/* Admin Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          {showCreateAdminForm ? (
            <CreateAdminForm 
              onAdminCreated={() => {
                setShowCreateAdminForm(false);
                fetchStats();
              }}
              onCancel={() => setShowCreateAdminForm(false)}
            />
          ) : (
            <div className="surface-card rounded-lg border border-zinc-700 p-6 text-center">
              <div className="mb-4 text-4xl">👥</div>
              <h3 className="mb-2 text-lg font-semibold">Manage Admins</h3>
              <p className="mb-4 text-sm text-zinc-400">
                Create and manage admin accounts for system administration
              </p>
              <button
                onClick={() => setShowCreateAdminForm(true)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                + Create New Admin
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="surface-card rounded-lg border border-zinc-700 p-6">
            <h3 className="mb-4 text-lg font-semibold">Admin Guidelines</h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex gap-2">
                <span className="text-blue-500">✓</span>
                <span>Only existing admins can create new admin accounts</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">✓</span>
                <span>Share temporary password securely with the new admin</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">✓</span>
                <span>New admins must change their password on first login</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">✓</span>
                <span>Admins have full access to user management and reporting</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">✓</span>
                <span>Maintain audit logs of all admin actions</span>
              </li>
            </ul>
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
