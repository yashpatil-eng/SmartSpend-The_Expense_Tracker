import { motion } from "framer-motion";
import { Mail, Linkedin, Github } from "lucide-react";

const TeamCard = ({ name, role, description, email, linkedin, github }) => {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_rgba(255,255,255,0.05)] backdrop-blur-2xl transition"
    >
      <div className="mb-4">
        <div className="mb-2 h-16 w-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center text-xl font-semibold">
          {name.split(" ").map((part) => part[0]).join("")}
        </div>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-sm text-sky-300">{role}</p>
      </div>
      <p className="mb-6 text-sm leading-6 text-zinc-400">{description}</p>
      <div className="space-y-2 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <a href={`mailto:${email}`} className="hover:text-white transition">{email}</a>
        </div>
        <div className="flex items-center gap-2">
          <Linkedin className="h-4 w-4" />
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">{linkedin}</a>
        </div>
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4" />
          <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">{github}</a>
        </div>
      </div>
    </motion.article>
  );
};

export default TeamCard;
