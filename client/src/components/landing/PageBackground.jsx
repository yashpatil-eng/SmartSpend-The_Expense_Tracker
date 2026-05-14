import { motion } from "framer-motion";

const PageBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_15%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_22%),linear-gradient(180deg,rgba(8,10,15,0.94),rgba(7,9,17,0.99))]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.75, scale: 1.1 }}
        transition={{ duration: 2.8, ease: "easeOut", repeat: Infinity, repeatType: "mirror" }}
        className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-slate-200/10 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.5, scale: 1.05 }}
        transition={{ duration: 3.4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        className="absolute right-0 top-28 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_35%)] opacity-30" />
    </div>
  );
};

export default PageBackground;
