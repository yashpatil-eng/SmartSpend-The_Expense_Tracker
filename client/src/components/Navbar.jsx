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
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          SmartSpend
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:block">{user.name}</span>
              <button
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-sm text-slate-700" to="/login">
                Login
              </Link>
              <Link className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white" to="/register">
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
