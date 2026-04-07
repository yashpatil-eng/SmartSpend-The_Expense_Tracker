import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-700 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-white">
          SmartSpend
        </Link>
        <Link
          to="/login"
          className="btn-secondary text-sm"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default LandingNavbar;
