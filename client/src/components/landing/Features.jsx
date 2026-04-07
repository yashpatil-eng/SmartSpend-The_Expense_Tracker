import { Brain, CalendarRange, PiggyBank, ReceiptIndianRupee } from "lucide-react";

const features = [
  { title: "Expense Tracking", icon: ReceiptIndianRupee, desc: "Log and manage every expense with smart categories." },
  { title: "Budget Planning", icon: PiggyBank, desc: "Set monthly limits and monitor your remaining budget." },
  { title: "AI Insights", icon: Brain, desc: "Get intelligent suggestions to reduce unnecessary spending." },
  { title: "Monthly Reports", icon: CalendarRange, desc: "View trend reports to understand spending behavior." }
];

const Features = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <h2 className="mb-6 text-2xl font-bold text-white">Features</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="surface-card p-5">
              <Icon className="mb-3 text-white" size={20} />
              <h3 className="font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{feature.desc}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
