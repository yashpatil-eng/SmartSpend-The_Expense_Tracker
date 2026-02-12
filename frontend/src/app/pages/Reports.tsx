import { useState } from "react";
import { FileText, Download, Calendar, Filter } from "lucide-react";

export function Reports() {
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-12");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock expense data
  const expenses = [
    { id: 1, date: "2026-06-12", title: "Grocery Shopping", category: "Food & Dining", amount: 125.50 },
    { id: 2, date: "2026-06-11", title: "Uber Ride", category: "Transportation", amount: 25.00 },
    { id: 3, date: "2026-06-10", title: "Netflix Subscription", category: "Entertainment", amount: 15.99 },
    { id: 4, date: "2026-06-09", title: "Electric Bill", category: "Bills & Utilities", amount: 89.30 },
    { id: 5, date: "2026-06-08", title: "Restaurant Dinner", category: "Food & Dining", amount: 67.80 },
    { id: 6, date: "2026-06-07", title: "Gas Station", category: "Transportation", amount: 55.00 },
    { id: 7, date: "2026-06-06", title: "Online Shopping", category: "Shopping", amount: 149.99 },
    { id: 8, date: "2026-06-05", title: "Movie Tickets", category: "Entertainment", amount: 32.00 },
    { id: 9, date: "2026-06-04", title: "Pharmacy", category: "Healthcare", amount: 43.25 },
    { id: 10, date: "2026-06-03", title: "Coffee Shop", category: "Food & Dining", amount: 12.50 },
  ];

  const categories = ["all", "Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Healthcare"];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    const matchesDate = expense.date >= startDate && expense.date <= endDate;
    return matchesCategory && matchesDate;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleExport = () => {
    alert("Exporting report as CSV...\nThis would download a CSV file in a real application.");
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Filter Reports</h2>
            <p className="text-sm text-gray-500">Customize your expense report</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="categoryFilter" className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 mb-1">Total Expenses</p>
            <p className="text-4xl font-bold">${totalAmount.toFixed(2)}</p>
            <p className="text-indigo-100 text-sm mt-2">{filteredExpenses.length} transactions</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium shadow-lg"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Expense Details</h3>
              <p className="text-sm text-gray-500">Detailed breakdown of expenses</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No expenses found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
