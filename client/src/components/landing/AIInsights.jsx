import { Lightbulb } from "lucide-react";

const insights = [
  "You are spending too much on Food",
  "You can save Rs. 5000 this month"
];

const AIInsights = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <div className="surface-card p-6 text-white sm:p-8">
        <h2 className="mb-4 text-2xl font-bold">AI Insights</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((item) => (
            <div key={item} className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
              <p className="flex items-center gap-2 text-sm sm:text-base">
                <Lightbulb size={18} />
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIInsights;
