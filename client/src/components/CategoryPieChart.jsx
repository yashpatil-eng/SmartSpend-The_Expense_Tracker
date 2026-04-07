import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#ffffff", "#e5e7eb", "#d4d4d8", "#a1a1aa", "#71717a", "#52525b"];

const CategoryPieChart = ({ data }) => (
  <div className="surface-card h-72 p-4">
    <h3 className="mb-2 text-sm font-medium text-gray-400">Category-wise Spending</h3>
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
