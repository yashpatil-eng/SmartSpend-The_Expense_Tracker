const accentMap = {
  indigo: "text-indigo-600",
  emerald: "text-emerald-600",
  rose: "text-rose-600",
  amber: "text-amber-600"
};

const StatCard = ({ title, value, accent = "indigo" }) => (
  <div className="rounded-xl border bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{title}</p>
    <p className={`mt-2 text-2xl font-semibold ${accentMap[accent] || accentMap.indigo}`}>{value}</p>
  </div>
);

export default StatCard;
