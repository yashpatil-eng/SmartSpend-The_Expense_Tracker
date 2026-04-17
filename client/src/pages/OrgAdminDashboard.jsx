import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const OrgAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [organization, setOrganization] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ email: "", assignRole: "" });
  const [budgetData, setBudgetData] = useState({ budget: "", budgetPeriod: "monthly" });

  useEffect(() => {
    if (user && user.orgRole !== "MANAGER" && user.orgRole !== "ORG_ADMIN" && user.orgRole !== "SUPER_ADMIN") {
      navigate("/dashboard");
    }
    fetchOrgData();
  }, [user, navigate]);

  const fetchOrgData = async () => {
    try {
      setLoading(true);
      const [orgRes, usersRes, transactionsRes, analyticsRes] = await Promise.all([
        api.get("/org/my-organization"),
        api.get("/org/users"),
        api.get("/org/transactions"),
        api.get("/org/analytics")
      ]);
      
      setOrganization(orgRes.data.organization);
      setUsers(usersRes.data.users || []);
      setTransactions(transactionsRes.data.transactions || []);
      setAnalytics(analyticsRes.data.analytics);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      await api.post("/org/add-user", {
        email: formData.email,
        assignRole: formData.assignRole
      });
      
      setFormData({ email: "", assignRole: "" });
      setShowAddUserForm(false);
      alert("User added successfully");
      fetchOrgData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!budgetData.budget || budgetData.budget < 0) {
      alert("Please enter a valid budget");
      return;
    }

    try {
      await api.post("/org/set-budget", {
        userId: selectedUser._id,
        budget: Number(budgetData.budget),
        budgetPeriod: budgetData.budgetPeriod
      });
      
      setBudgetData({ budget: "", budgetPeriod: "monthly" });
      setShowBudgetForm(false);
      setSelectedUser(null);
      alert("Budget updated successfully");
      fetchOrgData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update budget");
    }
  };

  const handleRemoveUser = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user from the organization?")) {
      try {
        await api.post("/org/remove-user", { userId });
        alert("User removed successfully");
        fetchOrgData();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to remove user");
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get("/org/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions-${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      alert("Failed to export CSV");
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get("/org/export/excel", { responseType: "blob" });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions-${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      alert("Failed to export Excel");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Organization Admin Dashboard</h1>
            <p className="text-gray-400">
              {organization?.name} • Code: <span className="font-mono">{organization?.orgCode}</span>
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-600 p-4 rounded mb-6 text-red-200">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {["overview", "users", "transactions", "export"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-2">Total Expenses</h3>
                <p className="text-3xl font-bold">₹{analytics?.totalExpenses?.toFixed(2)}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
                <p className="text-3xl font-bold">{analytics?.totalUsers}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-2">Net Balance</h3>
                <p className="text-3xl font-bold">₹{analytics?.net?.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Expenses by Category</h3>
              <div className="space-y-2">
                {analytics?.byCategory && Object.entries(analytics.byCategory).length > 0 ? (
                  Object.entries(analytics.byCategory).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-gray-300">{category}</span>
                      <span className="font-semibold">₹{amount?.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No expenses yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold"
              >
                {showAddUserForm ? "Cancel" : "+ Add User"}
              </button>
            </div>

            {showAddUserForm && (
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-4">Add User to Organization</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email*</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white"
                      placeholder="Enter user email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                      value={formData.assignRole}
                      onChange={(e) => setFormData({ ...formData, assignRole: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white"
                    >
                      <option value="">Regular User (No Admin)</option>
                      <option value="MANAGER">Organization Manager</option>
                      <option value="ORG_ADMIN">Organization Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
                  >
                    Add User
                  </button>
                </form>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
                <h3 className="font-bold">Organization Users</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {users.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-400">
                    No users in this organization yet
                  </div>
                ) : (
                  users.map((u) => (
                    <div key={u._id} className="px-6 py-4 hover:bg-gray-700 transition">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{u.name}</h4>
                          <p className="text-sm text-gray-400 mb-2">{u.email}</p>
                          <div className="flex gap-2 items-center">
                            <span className="inline-block px-2 py-1 rounded text-xs bg-blue-900 text-blue-200">
                              {u.orgRole}
                            </span>
                            {u.budget && (
                              <span className="text-sm text-gray-400">
                                Budget: ₹{u.budget} ({u.budgetPeriod})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setBudgetData({ budget: u.budget || "", budgetPeriod: u.budgetPeriod || "monthly" });
                              setShowBudgetForm(true);
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                          >
                            Set Budget
                          </button>
                          <button
                            onClick={() => handleRemoveUser(u._id)}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Budget Form Modal */}
        {showBudgetForm && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Set Budget for {selectedUser.name}</h3>
              <form onSubmit={handleSetBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Amount*</label>
                  <input
                    type="number"
                    step="0.01"
                    value={budgetData.budget}
                    onChange={(e) => setBudgetData({ ...budgetData, budget: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white"
                    placeholder="Enter budget amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Period</label>
                  <select
                    value={budgetData.budgetPeriod}
                    onChange={(e) => setBudgetData({ ...budgetData, budgetPeriod: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
                  >
                    Save Budget
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBudgetForm(false);
                      setSelectedUser(null);
                      setBudgetData({ budget: "", budgetPeriod: "monthly" });
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
              <h3 className="font-bold">All Organization Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                        No transactions yet
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
                      <tr key={t._id} className="hover:bg-gray-700 transition">
                        <td className="px-6 py-3">{t.userId?.name}</td>
                        <td className="px-6 py-3">₹{t.amount?.toFixed(2)}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            t.type === "income" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-6 py-3">{t.category}</td>
                        <td className="px-6 py-3">{new Date(t.date).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === "export" && (
          <div className="max-w-2xl">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Export Organization Data</h3>
              <div className="space-y-4">
                <button
                  onClick={handleExportCSV}
                  className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold flex items-center justify-center gap-2"
                >
                  📥 Export as CSV
                </button>
                <button
                  onClick={handleExportExcel}
                  className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold flex items-center justify-center gap-2"
                >
                  📥 Export as Excel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgAdminDashboard;
