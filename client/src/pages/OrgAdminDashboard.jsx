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
  const [userExpenses, setUserExpenses] = useState({}); // Store per-user expenses

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
      
      // ✅ Extract analytics - handle nested structure
      const analyticsData = analyticsRes.data.analytics || {};
      setAnalytics(analyticsData);
      
      // ✅ Calculate per-user expenses from transactions
      const userExpenseMap = {};
      (transactionsRes.data.transactions || []).forEach(t => {
        if (!userExpenseMap[t.userId?._id]) {
          userExpenseMap[t.userId?._id] = {
            userId: t.userId?._id,
            userName: t.userId?.name,
            totalExpense: 0,
            totalIncome: 0,
            count: 0
          };
        }
        if (t.type === "expense") {
          userExpenseMap[t.userId?._id].totalExpense += t.amount;
        } else {
          userExpenseMap[t.userId?._id].totalIncome += t.amount;
        }
        userExpenseMap[t.userId?._id].count += 1;
      });
      setUserExpenses(userExpenseMap);
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
        <div className="flex gap-4 mb-8 border-b border-gray-700 overflow-x-auto">
          {["overview", "users", "user-expenses", "transactions", "export"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "user-expenses" ? "User Expenses" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="text-gray-400 text-sm mb-2">Total Expenses</h3>
                <p className="text-3xl font-bold">₹{analytics?.summary?.totalExpenses?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-gray-400 text-sm mb-2">Net Balance</h3>
                <p className="text-3xl font-bold">₹{analytics?.summary?.balance?.toFixed(2) || "0.00"}</p>
              </div>
            </div>

            {/* Top Spenders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">👥 Top Spenders</h3>
                <div className="space-y-3">
                  {(analytics?.userBreakdown || [])
                    .slice(0, 5)
                    .map((userExp, idx) => (
                      <div key={userExp.userId} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 font-bold text-lg">#{idx + 1}</span>
                          <div>
                            <p className="font-semibold text-white">{userExp.userName}</p>
                            <p className="text-xs text-gray-400">{userExp.transactionCount} transactions</p>
                          </div>
                        </div>
                        <p className="text-red-400 font-bold">₹{userExp.expenses}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">📊 Expenses by Category</h3>
                <div className="space-y-2">
                  {(analytics?.categoryBreakdown || []).length > 0 ? (
                    (analytics?.categoryBreakdown || [])
                      .slice(0, 5)
                      .map((cat) => (
                        <div key={cat.category} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                          <span className="text-gray-300">{cat.category}</span>
                          <span className="font-semibold text-red-400">₹{cat.amount}</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-400">No expenses yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">📈 Quick Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-700 rounded">
                  <p className="text-xs text-gray-400">Avg per User</p>
                  <p className="text-lg font-bold text-blue-400">₹{analytics?.summary?.averageExpensePerUser?.toFixed(2) || "0.00"}</p>
                </div>
                <div className="p-3 bg-gray-700 rounded">
                  <p className="text-xs text-gray-400">Avg per Transaction</p>
                  <p className="text-lg font-bold text-blue-400">₹{analytics?.summary?.totalTransactions > 0 ? (analytics.summary.totalExpenses / analytics.summary.totalTransactions).toFixed(2) : "0.00"}</p>
                </div>
                <div className="p-3 bg-gray-700 rounded">
                  <p className="text-xs text-gray-400">Users with Activity</p>
                  <p className="text-lg font-bold text-purple-400">{Object.keys(userExpenses).length}</p>
                </div>
                <div className="p-3 bg-gray-700 rounded">
                  <p className="text-xs text-gray-400">Total Transactions</p>
                  <p className="text-lg font-bold text-green-400">{analytics?.summary?.totalTransactions || 0}</p>
                </div>
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

        {/* ✅ NEW: User Expenses Tab */}
        {activeTab === "user-expenses" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg">
                <h3 className="text-gray-300 text-sm mb-2 font-semibold">Total Organization Expense</h3>
                <p className="text-4xl font-bold text-blue-200">₹{analytics?.summary?.totalExpenses?.toFixed(2) || "0.00"}</p>
                <p className="text-xs text-gray-400 mt-2">{analytics?.summary?.expenseCount || 0} transactions</p>
              </div>
              <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-lg">
                <h3 className="text-gray-300 text-sm mb-2 font-semibold">Total Income</h3>
                <p className="text-4xl font-bold text-green-200">₹{analytics?.summary?.totalIncome?.toFixed(2) || "0.00"}</p>
                <p className="text-xs text-gray-400 mt-2">{analytics?.summary?.incomeCount || 0} transactions</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-lg">
                <h3 className="text-gray-300 text-sm mb-2 font-semibold">Net Balance</h3>
                <p className="text-4xl font-bold text-purple-200">₹{analytics?.summary?.balance?.toFixed(2) || "0.00"}</p>
                <p className="text-xs text-gray-400 mt-2">Income - Expense</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-6 rounded-lg">
                <h3 className="text-gray-300 text-sm mb-2 font-semibold">Active Users</h3>
                <p className="text-4xl font-bold text-indigo-200">{analytics?.userBreakdown?.length || 0}</p>
                <p className="text-xs text-gray-400 mt-2">With transactions</p>
              </div>
            </div>

            {/* Per-User Breakdown Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800 border-b border-gray-600">
                <h3 className="font-bold text-lg">📊 Per-User Expense Breakdown</h3>
                <p className="text-sm text-gray-400 mt-1">Individual user expenses and transaction summary</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700 border-b border-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">User Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Total Expense</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Total Income</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Net Balance</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Transactions</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">% of Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Budget Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {(analytics?.userBreakdown || []).length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                          No user transactions yet
                        </td>
                      </tr>
                    ) : (
                      (analytics?.userBreakdown || []).map((userExp, idx) => (
                        <tr key={userExp.userId} className="hover:bg-gray-700 transition">
                          <td className="px-6 py-3 font-medium text-white">{userExp.userName}</td>
                          <td className="px-6 py-3 text-red-400 font-semibold">₹{userExp.expenses}</td>
                          <td className="px-6 py-3 text-green-400 font-semibold">₹{userExp.income}</td>
                          <td className="px-6 py-3 font-semibold">
                            <span className={userExp.balance >= 0 ? "text-green-400" : "text-red-400"}>
                              ₹{userExp.balance}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-900 text-blue-200">
                              {userExp.transactionCount}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-block px-3 py-1 rounded-full text-sm bg-purple-900 text-purple-200">
                              {((userExp.expenses / (analytics?.summary?.totalExpenses || 1)) * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            {userExp.budget ? (
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-600 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      userExp.budgetUsage > 100 ? "bg-red-500" : userExp.budgetUsage > 75 ? "bg-yellow-500" : "bg-green-500"
                                    }`}
                                    style={{ width: `${Math.min(userExp.budgetUsage, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-400">{userExp.budgetUsage}%</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">No budget</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Summary */}
              {(analytics?.userBreakdown || []).length > 0 && (
                <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Total Users Tracked</p>
                      <p className="text-xl font-bold text-white">{analytics?.userBreakdown?.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Avg Expense per User</p>
                      <p className="text-xl font-bold text-red-400">₹{analytics?.summary?.averageExpensePerUser?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Avg Transactions per User</p>
                      <p className="text-xl font-bold text-blue-400">{((analytics?.summary?.totalTransactions || 0) / (analytics?.userBreakdown?.length || 1)).toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Highest Spender</p>
                      <p className="text-xl font-bold text-orange-400">
                        {(analytics?.userBreakdown || [])[0]?.userName || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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
