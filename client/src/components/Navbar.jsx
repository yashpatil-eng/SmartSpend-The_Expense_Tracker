import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-700 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-white">
          SmartSpend
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link className="text-sm text-white transition hover:text-gray-300" to="/dashboard">Dashboard</Link>
              <Link className="text-sm text-white transition hover:text-gray-300" to="/analytics">Analytics</Link>
              <Link className="text-sm text-white transition hover:text-gray-300" to="/ai-insights">AI</Link>
              <Link className="text-sm text-white transition hover:text-gray-300" to="/settings">Settings</Link>
              <span className="hidden text-sm text-gray-400 sm:block">{user.name}</span>
              <button
                className="btn-secondary text-sm"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-sm text-white transition hover:text-gray-300" to="/login">
                Login
              </Link>
              <Link className="btn-primary text-sm" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
