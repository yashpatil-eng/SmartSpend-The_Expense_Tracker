import { BarChart3, Building2, LockKeyhole, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <ReceiptText size={20} />,
    title: "Expense Tracking",
    description: "Log income and expenses in seconds with clean categories and fast workflows."
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Data Visualization",
    description: "Understand spending trends instantly with smart charts and breakdowns."
  },
  {
    icon: <LockKeyhole size={20} />,
    title: "Secure Authentication",
    description: "Use Email, Google, and OTP sign-in with secure token-based access."
  },
  {
    icon: <Building2 size={20} />,
    title: "Multi-user Organization",
    description: "Built for personal budgeting and organization-level expense management."
  }
];

const SectionHeading = ({ title, subtitle }) => (
  <div className="mx-auto mb-10 max-w-2xl text-center">
    <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
    <p className="mt-3 text-sm text-zinc-400 md:text-base">{subtitle}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="relative min-h-screen scroll-smooth overflow-hidden bg-black font-sans text-white">
      <style>{`
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.13),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.10),transparent_25%),linear-gradient(to_bottom,#000000,#111111,#18181b)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/50 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <a href="#home" className="text-lg font-semibold tracking-wide text-white">
            SmartSpend
          </a>
          <div className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
            <a href="#home" className="transition hover:text-white">Home</a>
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#about" className="transition hover:text-white">About</a>
            <Link to="/login" className="rounded-full border border-white/20 px-4 py-1.5 transition hover:border-white hover:bg-white hover:text-black">
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section id="home" className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-16 md:grid-cols-2 md:px-6 md:pt-24">
          <div className="animate-[fadeInUp_0.7s_ease-out]">
            <p className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Premium Expense Intelligence
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
              Take Control of Your Expenses
            </h1>
            <p className="mt-5 max-w-xl text-base text-zinc-300 md:text-lg">
              Track, analyze and manage your money smartly with SmartSpend.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02] hover:bg-zinc-200">
                Get Started
              </Link>
              <Link to="/login" className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:border-white hover:bg-white/10">
                Login
              </Link>
            </div>
          </div>

          <div className="relative animate-[floatSoft_4s_ease-in-out_infinite] rounded-3xl border border-white/15 bg-white/5 p-5 shadow-[0_20px_80px_rgba(255,255,255,0.08)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm text-zinc-300">Finance Dashboard</h3>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">Live</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-black/50 p-3">
                <p className="text-xs text-zinc-400">This Month Spend</p>
                <p className="text-xl font-semibold">$2,480</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-20 rounded-lg bg-zinc-100/90" />
                <div className="h-20 rounded-lg bg-zinc-300/80" />
                <div className="h-20 rounded-lg bg-zinc-500/80" />
              </div>
              <div className="h-2 rounded-full bg-zinc-800">
                <div className="h-2 w-2/3 rounded-full bg-white" />
              </div>
              <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-xs text-zinc-300">
                Smart insight: Dining expense increased by 18% from last week.
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
          <SectionHeading
            title="Built for speed, clarity and control"
            subtitle="A clean black and white interface with robust features for individuals and organizations."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="surface-card p-5 text-white"
              >
                <div className="mb-4 inline-flex rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-white">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="mx-auto w-full max-w-4xl px-4 py-16 text-center md:px-6">
          <div className="rounded-3xl border border-white/20 bg-white/5 p-10 backdrop-blur">
            <h3 className="text-3xl font-semibold tracking-tight">Start Managing Your Money Today</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-300 md:text-base">
              Upgrade your expense workflow with a premium dashboard designed for modern personal finance and teams.
            </p>
            <Link
              to="/register"
              className="mt-7 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.35)] transition hover:scale-[1.02] hover:bg-zinc-200"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-400 md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} SmartSpend. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#about" className="transition hover:text-white">About</a>
            <a href="mailto:support@smartspend.app" className="transition hover:text-white">Contact</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="transition hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
