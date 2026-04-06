import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-emerald-700">
          SmartSpend
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default LandingNavbar;
