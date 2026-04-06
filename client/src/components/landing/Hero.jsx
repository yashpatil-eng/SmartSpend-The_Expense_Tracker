import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:pt-16">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-green-100 p-8 shadow-sm sm:p-12">
        <p className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          AI-Powered Personal Finance
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Track Smarter, Spend Better
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Manage your expenses, control your budget, and get AI-powered insights.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
        >
          Get Started
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
