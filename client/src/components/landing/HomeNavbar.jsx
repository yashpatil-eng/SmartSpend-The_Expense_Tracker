import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "AI", href: "#ai" },
  { label: "Team", href: "#footer" },
  { label: "Contact", href: "#footer" }
];

const HomeNavbar = () => {
  const [navVisible, setNavVisible] = useState(true);
  const [navSolid, setNavSolid] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleNav = () => {
      const currentY = window.scrollY;
      const atTop = currentY < 30;

      setNavSolid(!atTop);

      if (atTop) {
        setNavVisible(true);
      } else if (currentY > lastScrollY.current + 20) {
        setNavVisible(false);
      } else if (currentY < lastScrollY.current - 10) {
        setNavVisible(true);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(handleNav);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transform transition-all duration-300 ease-out ${navVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8 ${navSolid ? "py-3 bg-black/80 backdrop-blur-xl border-b border-zinc-800/70 shadow-[0_20px_60px_rgba(0,0,0,0.32)]" : "py-4 bg-transparent"}`}
      >
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/90">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-[0_20px_90px_rgba(255,255,255,0.06)] backdrop-blur-xl ${navSolid ? "bg-white/10" : "bg-white/12"}`}>
            <Sparkles className="h-5 w-5 text-sky-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">SmartSpend</p>
            <p className="text-xs text-zinc-400">Premium finance</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-300 md:flex">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition duration-300 hover:text-white hover:underline hover:underline-offset-8"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition duration-300 hover:border-white hover:bg-white/10 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_16px_40px_rgba(255,255,255,0.18)] transition duration-300 hover:shadow-[0_24px_70px_rgba(255,255,255,0.24)] hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;
