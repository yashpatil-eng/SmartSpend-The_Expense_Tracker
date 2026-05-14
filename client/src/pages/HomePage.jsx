import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChartPie, ShieldCheck, CreditCard, Activity, Zap, Sparkles, CircleDollarSign, Github, Linkedin, Mail, Globe } from "lucide-react";
import HomeNavbar from "../components/landing/HomeNavbar";
import PageBackground from "../components/landing/PageBackground";
import FeatureCard from "../components/landing/FeatureCard";
import AnalyticsPreview from "../components/landing/AnalyticsPreview";

const stats = [
  { label: "Transactions tracked", value: "1.6M+" },
  { label: "Active users", value: "42K" },
  { label: "Analytics generated", value: "120K" }
];

const features = [
  {
    icon: <Activity className="h-6 w-6" />,
    title: "Expense Tracking",
    description: "Capture every spend instantly with clean categories, smart tags and recurring plans."
  },
  {
    icon: <ChartPie className="h-6 w-6" />,
    title: "AI Analysis",
    description: "Receive automated spending insights, alerts, and savings suggestions in real time."
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Analytics Dashboard",
    description: "Premium charts, trend breakdowns, and cashflow visibility for every account."
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Bill Upload",
    description: "Snap and upload invoices to match payments and keep budgets accurate."
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Secure Authentication",
    description: "Multi-layer security with email, Google, and encrypted session management."
  },
  {
    icon: <CircleDollarSign className="h-6 w-6" />,
    title: "Organization Management",
    description: "Scale finance workflows across teams with role-based access and audit trails."
  }
];

const insights = [
  {
    title: "Expense pulse",
    description: "You spent 20% more on food this month. Review recurring dining out subscriptions."
  },
  {
    title: "Subscription savings",
    description: "You can save ₹3000 by pausing unused streaming and productivity subscriptions."
  },
  {
    title: "Budget boost",
    description: "Your monthly savings rate improved by 14% after optimizing grocery spending."
  }
];

const steps = [
  { title: "Register", description: "Create your account and link your first wallet in seconds." },
  { title: "Add Transactions", description: "Log bills, payments and incomes with minimal effort." },
  { title: "Analyze & Save", description: "Get AI recommendations and turn insights into action." }
];

const contributors = [
  { name: "Yash Umesh Patil", role: "Contributor" },
  { name: "Tejas Ravindra Patil", role: "Contributor" },
  { name: "Jayesh Dilip Mokase", role: "Contributor" },
  { name: "Dipak Laxman Khillare", role: "Contributor" }
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
      <PageBackground />
      <HomeNavbar />

      <main className="relative z-10">
        <section id="home" className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-sky-200 shadow-[0_10px_40px_rgba(56,189,248,0.12)]">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
                Premium fintech experience built for modern teams
              </div>

              <div className="space-y-6">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl xl:text-7xl">
                  Manage Money Smarter with <span className="text-sky-300">SmartSpend</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
                  Track expenses, analyze spending, and gain AI-powered financial insights with a premium dashboard built for founders, finance teams, and businesses.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-100"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Live Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 text-white/90 backdrop-blur-xl">
                    <p className="text-3xl font-semibold">{item.value}</p>
                    <p className="mt-1 text-sm text-zinc-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.4)] backdrop-blur-3xl"
            >
              <div className="absolute -right-16 top-6 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />
              <div className="absolute -left-16 bottom-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
              <div className="flex items-center justify-between rounded-[2rem] border border-white/10 bg-black/40 px-5 py-4 text-white/80 shadow-inner shadow-black/10">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Live dashboard</p>
                  <p className="mt-2 text-sm text-zinc-300">Insights updated every minute</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white">Beta</span>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-[2rem] border border-white/10 bg-black/60 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Spending overview</p>
                  <div className="mt-6 space-y-4">
                    {[
                      { label: "Bills", value: "₹8.4K", accent: "bg-sky-400/80" },
                      { label: "Travel", value: "₹4.1K", accent: "bg-violet-400/80" },
                      { label: "Savings", value: "₹12.2K", accent: "bg-white/20" }
                    ].map((item) => (
                      <div key={item.label} className="rounded-3xl bg-white/5 p-4">
                        <div className="flex items-center justify-between text-sm text-zinc-400">
                          <span>{item.label}</span>
                          <span className="text-white">{item.value}</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-white/10">
                          <div className={`${item.accent} h-full rounded-full`} style={{ width: item.label === "Savings" ? "74%" : item.label === "Bills" ? "62%" : "45%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-black/60 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-sky-300">AI recommendations</p>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/80">Reduce recurring subscriptions by 14% to boost monthly cashflow.</p>
                    </div>
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/80">Move excess savings into a dedicated emergency reserve for faster growth.</p>
                    </div>
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/80">Set a custom food budget and receive time-based alerts when you approach it.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/50 p-5">
                <div className="mb-4 flex items-center justify-between text-white/80">
                  <span className="text-sm">Cash flow</span>
                  <span className="text-xs uppercase tracking-[0.22em] text-sky-300">Projected</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Income", value: "₹65K" },
                    { label: "Expenses", value: "₹37K" },
                    { label: "Net", value: "₹28K" }
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl bg-white/5 p-4 text-center">
                      <p className="text-sm text-zinc-400">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-10 max-w-3xl"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Feature highlights</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">A premium toolkit for financial growth.</h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">Designed to deliver elegant workflows, deeper control, and faster decisions with intelligent automation.</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section id="analytics" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <AnalyticsPreview />
        </section>

        <section id="ai" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-10 max-w-3xl"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">AI insights</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Actionable insights, delivered instantly.</h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">Review what matters most and use AI-driven guidance to optimize budgets, subscriptions, and spending behavior.</p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {insights.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -5 }}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(255,255,255,0.07)] backdrop-blur-2xl transition"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-400/10 text-sky-300">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-10 max-w-3xl"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">How it works</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Launch financial clarity in three steps.</h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="rounded-[2rem] border border-white/10 bg-black/40 p-7"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/5 text-sky-300">
                  <span className="text-lg font-semibold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="cta" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/90 p-10 shadow-[0_30px_120px_rgba(15,23,42,0.55)] backdrop-blur-2xl"
          >
            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
              <div className="space-y-5">
                <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Take control</p>
                <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Take Control of Your Financial Future</h2>
                <p className="max-w-2xl text-base leading-7 text-zinc-400">Start a smarter expense journey with AI-powered guidance, premium analytics, and secure finance workflows built for teams.</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-sky-300"
                >
                  Start Free
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer id="footer" className="border-t border-white/10 bg-zinc-950/95 px-4 py-16 text-zinc-300 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_rgba(255,255,255,0.06)] backdrop-blur-2xl">
            <p className="text-lg font-semibold text-white">SmartSpend - Expense Tracker</p>
            <p className="mt-4 text-sm leading-6 text-zinc-400">A modern smart expense tracking and financial analytics platform designed to help users manage money efficiently.</p>
            <div className="mt-6 space-y-3 text-sm text-zinc-400">
              <p><span className="font-medium text-white">Location:</span> Government College of Engineering, Jalgaon</p>
              <p><span className="font-medium text-white">Project Email:</span> <a href="mailto:smartspend.team@example.com" className="text-sky-300 hover:text-white transition">smartspend.team@example.com</a></p>
              <p><span className="font-medium text-white">Support:</span> <a href="mailto:support.smartspend@example.com" className="text-sky-300 hover:text-white transition">support.smartspend@example.com</a></p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_rgba(255,255,255,0.06)] backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Contributors</p>
            <div className="mt-6 space-y-4">
              {contributors.map((contributor) => (
                <div key={contributor.name} className="group rounded-3xl border border-white/10 bg-black/30 p-4 transition hover:border-sky-400 hover:bg-white/10">
                  <p className="text-base font-semibold text-white transition group-hover:text-sky-300">{contributor.name}</p>
                  <p className="text-sm text-zinc-400">{contributor.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_rgba(255,255,255,0.06)] backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Project contact</p>
            <div className="mt-6 space-y-4 text-sm text-zinc-400">
              <div>
                <p className="font-medium text-white">smartspend.team@example.com</p>
                <p>Project Email</p>
              </div>
              <div>
                <p className="font-medium text-white">support.smartspend@example.com</p>
                <p>Support Email</p>
              </div>
              <div>
                <p className="font-medium text-white">+91 98765 43210</p>
                <p>Phone</p>
              </div>
              <div>
                <p className="font-medium text-white">Government College of Engineering, Jalgaon, Maharashtra, India</p>
                <p>Location</p>
              </div>
              <div>
                <p className="font-medium text-white">Monday - Friday | 9:00 AM - 6:00 PM</p>
                <p>Working Hours</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_rgba(255,255,255,0.06)] backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Social links</p>
            <div className="mt-6 space-y-4 text-sm">
              <a href="" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-white transition hover:-translate-y-1 hover:border-sky-400 hover:text-sky-300">
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a href="" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-white transition hover:-translate-y-1 hover:border-sky-400 hover:text-sky-300">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a href="mailto:smartspend.team@example.com" className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-white transition hover:-translate-y-1 hover:border-sky-400 hover:text-sky-300">
                <Mail className="h-4 w-4" /> Email
              </a>
              <a href="https://smartspend-demo.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-white transition hover:-translate-y-1 hover:border-sky-400 hover:text-sky-300">
                <Globe className="h-4 w-4" /> Website
              </a>
            </div>
            <div className="mt-8 rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
              <p className="text-white">GitHub Repository</p>
              <a href="" target="_blank" rel="noopener noreferrer" className="text-sky-300 transition hover:text-white">github.com/smartspend</a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-zinc-500">
          © 2026 SmartSpend. All Rights Reserved. Built with <span className="text-rose-400">❤️</span> by Team SmartSpend
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
