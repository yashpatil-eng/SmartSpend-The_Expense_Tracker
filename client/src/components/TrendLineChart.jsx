import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TrendLineChart = ({ data }) => (
  <div className="surface-card h-72 p-4">
    <h3 className="mb-2 text-sm font-medium text-gray-400">Monthly Trend</h3>
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
        <XAxis dataKey="month" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#9b59b6" strokeWidth={3} dot={{ fill: '#9b59b6', r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TrendLineChart;
