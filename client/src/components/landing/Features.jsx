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
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Features</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <Icon className="mb-3 text-emerald-600" size={20} />
              <h3 className="font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
