const accentMap = {
  indigo: "text-white",
  emerald: "text-white",
  rose: "text-white",
  amber: "text-white"
};

const StatCard = ({ title, value, accent = "indigo" }) => (
  <div className="surface-card p-4">
    <p className="text-sm text-gray-400">{title}</p>
    <p className={`mt-2 text-2xl font-semibold ${accentMap[accent] || accentMap.indigo}`}>{value}</p>
  </div>
);

export default StatCard;
