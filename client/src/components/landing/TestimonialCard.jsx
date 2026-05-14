import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TestimonialCard = ({ feedback, name, title }) => {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(255,255,255,0.06)] backdrop-blur-2xl transition"
    >
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-lg">
          {name.split(" ").map((part) => part[0]).join("")}
        </div>
        <div>
          <p className="text-base font-semibold text-white">{name}</p>
          <p className="text-sm text-zinc-400">{title}</p>
        </div>
      </div>
      <div className="mb-5 flex items-center gap-1 text-amber-300">
        {[...Array(5)].map((_, index) => (
          <Star key={index} className="h-4 w-4" />
        ))}
      </div>
      <p className="text-sm leading-6 text-zinc-300">{feedback}</p>
    </motion.article>
  );
};

export default TestimonialCard;
