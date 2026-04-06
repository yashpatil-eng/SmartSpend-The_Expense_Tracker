import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const CategoryPieChart = ({ data }) => (
  <div className="h-72 rounded-xl border bg-white p-4 shadow-sm">
    <h3 className="mb-2 text-sm font-medium text-slate-600">Category-wise Spending</h3>
    <ResponsiveContainer width="100%" height="90%">
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="category" outerRadius={90}>
          {data?.map((entry, index) => (
            <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default CategoryPieChart;
