import { motion } from "framer-motion";
import { TrendingUp, PieChart, BarChart3, Sparkles } from "lucide-react";

const AnalyticsPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
    >
      <div className="mb-6 flex items-center justify-between rounded-3xl border border-white/10 bg-black/40 p-4 text-white/90">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sky-300">Smart analytics</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Powerful financial analytics at your fingertips.</h2>
        </div>
        <Sparkles className="h-10 w-10 text-sky-300" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-[1.75rem] bg-black/40 p-5">
          <div className="mb-5 flex items-center justify-between text-white/80">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em]">Trends</span>
            <span className="text-sm text-sky-300">Live</span>
          </div>
          <div className="mb-6 h-56 rounded-[1.4rem] bg-gradient-to-br from-sky-500/10 via-transparent to-violet-500/5 p-4">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Income</span>
                <span>Expense</span>
              </div>
              <div className="space-y-3">
                {[80, 65, 90, 55, 72].map((height, index) => (
                  <div key={index} className="flex items-end gap-3">
                    <div className="h-2 rounded-full bg-zinc-700/60 flex-1" />
                    <div className="h-2 rounded-full bg-sky-400/80" style={{ width: `${height}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-white/5 p-4 text-sm text-zinc-300">
                <span>Accuracy</span>
                <span className="text-white">98.3%</span>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Savings", value: "₹24.2K" },
              { label: "ROI", value: "12.6%" },
              { label: "Alerts", value: "9" }
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-white/10 bg-black/40 p-5">
            <div className="mb-4 flex items-center gap-3 text-white/80">
              <PieChart className="h-4 w-4 text-sky-300" />
              <span className="text-sm">Category distribution</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { count: "42%", label: "Bills" },
                { count: "28%", label: "Food" },
                { count: "30%", label: "Travel" }
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-white/5 p-4 text-sm text-zinc-300">
                  <p className="text-xl font-semibold text-white">{item.count}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-white/90">
            <div className="mb-4 flex items-center gap-3 text-white/80">
              <BarChart3 className="h-4 w-4 text-violet-300" />
              <span className="text-sm">Income vs Expense</span>
            </div>
            <div className="space-y-4">
              {[
                { label: "Income", value: "₹64K", accent: "from-sky-400 to-cyan-500" },
                { label: "Expense", value: "₹39K", accent: "from-violet-400 to-fuchsia-500" }
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>{item.label}</span>
                    <span className="text-white">{item.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full bg-gradient-to-r ${item.accent}`} style={{ width: item.label === "Income" ? "82%" : "52%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPreview;
