const steps = [
  "Step 1: Add Expenses",
  "Step 2: Categorize Spending",
  "Step 3: Get Insights"
];

const HowItWorks = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">How It Works</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-emerald-700">0{index + 1}</p>
            <p className="mt-1 font-medium text-slate-800">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
