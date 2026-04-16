import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f39c12", "#9b59b6", "#1abc9c", "#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#16a085"];

const CategoryPieChart = ({ data }) => (
  <div className="surface-card h-72 p-4">
    <h3 className="mb-2 text-sm font-medium text-gray-400">Category-wise Spending</h3>
    {data?.length ? (
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} dataKey="amount" nameKey="category" outerRadius={90}>
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-sm text-gray-400">No category data available.</p>
    )}
  </div>
);

export default CategoryPieChart;
