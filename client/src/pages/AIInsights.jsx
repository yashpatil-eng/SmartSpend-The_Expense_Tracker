import { useEffect, useState } from "react";
import api from "../api/axios";

const AIInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/ai/insights");
        setInsights(data.insights || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <div className="surface-card p-4">
        <h2 className="text-2xl font-semibold">AI Analysis</h2>
        <p className="text-sm text-gray-400">Pattern detection, budget suggestions, smart alerts and savings tips.</p>
      </div>
      {loading ? <p className="text-gray-400">Loading insights...</p> : null}
      {insights.map((insight) => (
        <div key={insight} className="surface-card p-4">
          <p>{insight}</p>
        </div>
      ))}
    </div>
  );
};

export default AIInsights;
