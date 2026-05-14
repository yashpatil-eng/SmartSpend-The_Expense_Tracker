import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_rgba(255,255,255,0.05)] backdrop-blur-2xl transition"
    >
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-sky-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
      <div className="mt-6 h-1 w-10 rounded-full bg-gradient-to-r from-sky-400 to-violet-400 opacity-0 transition group-hover:opacity-100" />
    </motion.article>
  );
};

export default FeatureCard;
