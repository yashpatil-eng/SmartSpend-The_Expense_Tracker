import { BriefcaseBusiness, GraduationCap, Laptop } from "lucide-react";

const useCases = [
  { title: "Student", icon: GraduationCap, desc: "Track allowance, food, and travel spending easily." },
  { title: "Freelancer", icon: Laptop, desc: "Separate personal and project expenses with clarity." },
  { title: "Business", icon: BriefcaseBusiness, desc: "Monitor operational spending and improve cash flow." }
];

const UseCases = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Use Cases</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {useCases.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <Icon className="mb-3 text-emerald-600" size={20} />
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default UseCases;
