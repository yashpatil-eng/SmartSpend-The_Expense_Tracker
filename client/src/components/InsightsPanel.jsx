const InsightsPanel = ({ insights = [] }) => (
  <div className="surface-card p-4">
    <h3 className="mb-3 text-lg font-semibold">AI Insights</h3>
    <ul className="space-y-2 text-sm text-gray-400">
      {insights.map((insight) => (
        <li key={insight} className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-white">{insight}</li>
      ))}
    </ul>
  </div>
);

export default InsightsPanel;
