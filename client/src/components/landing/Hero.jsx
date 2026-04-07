import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:pt-16">
      <div className="surface-card bg-gradient-to-br from-black to-zinc-900 p-8 sm:p-12">
        <p className="mb-3 inline-block rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-gray-400">
          AI-Powered Personal Finance
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Track Smarter, Spend Better
        </h1>
        <p className="mt-4 max-w-2xl text-gray-400">
          Manage your expenses, control your budget, and get AI-powered insights.
        </p>
        <Link
          to="/register"
          className="btn-primary mt-6"
        >
          Get Started
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
