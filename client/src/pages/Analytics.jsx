import { useEffect, useState } from "react";
import { Bar, BarChart, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import api from "../api/axios";
import { formatCurrency } from "../utils/format";

const pieColors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f39c12", "#9b59b6", "#1abc9c", "#e74c3c", "#3498db", "#2ecc71", "#f1c40f"];

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
              <Bar dataKey="amount" fill="#3498db" radius={[8, 8, 0, 0]} />
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
            <Line dataKey="income" stroke="#2ecc71" strokeWidth={3} dot={{ fill: '#2ecc71', r: 5 }} />
            <Line dataKey="expense" stroke="#e74c3c" strokeWidth={3} dot={{ fill: '#e74c3c', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
