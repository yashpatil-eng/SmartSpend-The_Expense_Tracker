import { useEffect, useState } from "react";
import { Bar, BarChart, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import api from "../api/axios";
import { formatCurrency } from "../utils/format";

const pieColors = ["#ffffff", "#d4d4d8", "#a1a1aa", "#71717a", "#52525b"];

const Analytics = () => {
  const [filters, setFilters] = useState({ startDate: "", endDate: "", category: "" });
  const [summary, setSummary] = useState({ totalSpent: 0, highestCategory: "N/A", avgDailyExpense: 0 });
  const [charts, setCharts] = useState({ monthlyExpenses: [], categorySpending: [], incomeVsExpense: [] });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const [summaryRes, chartRes] = await Promise.all([
        api.get("/analytics/summary", { params }),
        api.get("/analytics/charts", { params })
      ]);
      setSummary(summaryRes.data);
      setCharts(chartRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <div className="surface-card grid gap-3 p-4 md:grid-cols-4">
        <input className="field-input" type="date" value={filters.startDate} onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))} />
        <input className="field-input" type="date" value={filters.endDate} onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))} />
        <input className="field-input" placeholder="Category filter" value={filters.category} onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))} />
        <button className="btn-primary" onClick={load}>Apply Filters</button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-4"><p className="text-gray-400">Total Spent This Period</p><p className="text-2xl font-semibold">{formatCurrency(summary.totalSpent)}</p></div>
        <div className="surface-card p-4"><p className="text-gray-400">Highest Category</p><p className="text-2xl font-semibold">{summary.highestCategory}</p></div>
        <div className="surface-card p-4"><p className="text-gray-400">Avg Daily Expense</p><p className="text-2xl font-semibold">{formatCurrency(summary.avgDailyExpense)}</p></div>
      </div>

      {loading ? <p className="text-gray-400">Loading analytics...</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface-card h-80 p-4">
          <h3 className="mb-2 text-sm text-gray-400">Monthly Expenses</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={charts.monthlyExpenses}>
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="amount" fill="#ffffff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="surface-card h-80 p-4">
          <h3 className="mb-2 text-sm text-gray-400">Category-wise Spending</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={charts.categorySpending} dataKey="amount" nameKey="category" outerRadius={100}>
                {charts.categorySpending.map((entry, index) => (
                  <Cell key={entry.category} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="surface-card h-80 p-4">
        <h3 className="mb-2 text-sm text-gray-400">Income vs Expense</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={charts.incomeVsExpense}>
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line dataKey="income" stroke="#ffffff" />
            <Line dataKey="expense" stroke="#9ca3af" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
