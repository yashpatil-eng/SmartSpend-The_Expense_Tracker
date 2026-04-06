const InsightsPanel = ({ insights = [] }) => (
  <div className="rounded-xl border bg-white p-4 shadow-sm">
    <h3 className="mb-3 text-lg font-semibold">AI Insights</h3>
    <ul className="space-y-2 text-sm text-slate-700">
      {insights.map((insight) => (
        <li key={insight} className="rounded-lg bg-indigo-50 p-3">{insight}</li>
      ))}
    </ul>
  </div>
);

export default InsightsPanel;
