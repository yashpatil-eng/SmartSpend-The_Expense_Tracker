import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TrendLineChart = ({ data }) => (
  <div className="h-72 rounded-xl border bg-white p-4 shadow-sm">
    <h3 className="mb-2 text-sm font-medium text-slate-600">Monthly Trend</h3>
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TrendLineChart;
