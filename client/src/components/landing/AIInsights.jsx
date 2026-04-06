import { Lightbulb } from "lucide-react";

const insights = [
  "You are spending too much on Food",
  "You can save Rs. 5000 this month"
];

const AIInsights = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <div className="rounded-2xl bg-emerald-700 p-6 text-white sm:p-8">
        <h2 className="mb-4 text-2xl font-bold">AI Insights</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((item) => (
            <div key={item} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
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
