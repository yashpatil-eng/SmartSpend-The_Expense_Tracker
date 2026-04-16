import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../utils/translations";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const t = (key) => getTranslation(key, language);
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
              <Link className="text-sm text-white transition hover:text-gray-300" to="/dashboard">{t("dashboard")}</Link>
              <Link className="text-sm text-white transition hover:text-gray-300" to="/analytics">{t("analytics")}</Link>
              <Link className="text-sm text-white transition hover:text-gray-300" to="/ai-insights">{t("ai_insights")}</Link>
              <Link className="text-sm text-white transition hover:text-gray-300" to="/settings">{t("settings")}</Link>
              {user.role === "admin" && (
                <Link className="text-sm text-blue-400 transition hover:text-blue-300 font-semibold" to="/admin">
                  🔐 Admin Panel
                </Link>
              )}
              <span className="hidden text-sm text-gray-400 sm:block">{user.name}</span>
              {user.role === "admin" && (
                <span className="hidden text-xs font-bold px-2 py-1 bg-blue-600 text-blue-100 rounded sm:block">
                  Admin
                </span>
              )}
              <button
                className="btn-secondary text-sm"
                onClick={onLogout}
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link className="text-sm text-white transition hover:text-gray-300" to="/login">
                {t("login")}
              </Link>
              <Link className="btn-primary text-sm" to="/register">
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
