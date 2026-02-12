import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

export function Dashboard() {
  // Mock data
  const totalExpense = 12459.50;
  const monthlyExpense = 4327.80;
  const budget = 5000;
  const budgetUsed = (monthlyExpense / budget) * 100;

  // Category data for pie chart
  const categoryData = [
    { name: "Food & Dining", value: 1250, color: "#4F46E5" },
    { name: "Transportation", value: 850, color: "#22C55E" },
    { name: "Shopping", value: 680, color: "#F59E0B" },
    { name: "Entertainment", value: 520, color: "#EF4444" },
    { name: "Bills & Utilities", value: 1027.80, color: "#8B5CF6" },
  ];

  // Monthly trend data for bar chart
  const monthlyData = [
    { month: "Jan", amount: 3200 },
    { month: "Feb", amount: 4100 },
    { month: "Mar", amount: 3800 },
    { month: "Apr", amount: 4500 },
    { month: "May", amount: 3950 },
    { month: "Jun", amount: 4327.80 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Expense Card */}
        <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-red-600">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Expense</h3>
          <p className="text-3xl font-bold text-gray-900">${totalExpense.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Since account creation</p>
        </div>

        {/* Monthly Expense Card */}
        <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-secondary" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingDown className="w-4 h-4" />
              -5%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">This Month</h3>
          <p className="text-3xl font-bold text-gray-900">${monthlyExpense.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">June 2026</p>
        </div>

        {/* Budget Status Card */}
        <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <span className={`text-sm font-medium ${budgetUsed > 80 ? "text-red-600" : "text-green-600"}`}>
              {budgetUsed.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Budget Status</h3>
          <p className="text-3xl font-bold text-gray-900">${(budget - monthlyExpense).toLocaleString()}</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Remaining</span>
              <span>${budget.toLocaleString()} limit</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  budgetUsed > 80 ? "bg-red-500" : "bg-secondary"
                }`}
                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Expense by Category</h3>
              <p className="text-sm text-gray-500">Current month breakdown</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Bar Chart */}
        <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Trend</h3>
              <p className="text-sm text-gray-500">Last 6 months</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
        <div className="space-y-3">
          {[
            { title: "Grocery Shopping", amount: 125.50, category: "Food & Dining", date: "Jun 12, 2026", color: "bg-indigo-100 text-indigo-700" },
            { title: "Uber Ride", amount: 25.00, category: "Transportation", date: "Jun 11, 2026", color: "bg-green-100 text-green-700" },
            { title: "Netflix Subscription", amount: 15.99, category: "Entertainment", date: "Jun 10, 2026", color: "bg-red-100 text-red-700" },
            { title: "Electric Bill", amount: 89.30, category: "Bills & Utilities", date: "Jun 9, 2026", color: "bg-purple-100 text-purple-700" },
          ].map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${expense.color}`}>
                  {expense.category}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.title}</p>
                  <p className="text-sm text-gray-500">{expense.date}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
