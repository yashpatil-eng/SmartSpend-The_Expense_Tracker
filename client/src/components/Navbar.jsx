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

  const getRoleColor = () => {
    switch (user?.orgRole) {
      case "SUPER_ADMIN":
        return "bg-purple-600 text-purple-100";
      case "MANAGER":
        return "bg-orange-600 text-orange-100";
      case "ORG_ADMIN":
        return "bg-orange-600 text-orange-100";
      default:
        return "bg-blue-600 text-blue-100";
    }
  };

  const getRoleBadge = () => {
    if (user?.orgRole === "SUPER_ADMIN") return "👑 SUPER_ADMIN";
    if (user?.orgRole === "ORG_ADMIN") return "🔧 ORG_ADMIN";
    return null;
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
              {user.orgRole === "SUPER_ADMIN" ? (
                <>
                  <Link className="text-sm text-white transition hover:text-gray-300" to="/super-admin">Super Admin</Link>
                </>
              ) : user.orgRole === "ORG_ADMIN" ? (
                <>
                  <Link className="text-sm text-white transition hover:text-gray-300" to="/org-admin">Organization</Link>
                </>
              ) : (
                <>
                  <Link className="text-sm text-white transition hover:text-gray-300" to="/dashboard">{t("dashboard")}</Link>
                  <Link className="text-sm text-white transition hover:text-gray-300" to="/analytics">{t("analytics")}</Link>
                  <Link className="text-sm text-white transition hover:text-gray-300" to="/ai-insights">{t("ai_insights")}</Link>
                  <Link className="text-sm text-white transition hover:text-gray-300" to="/settings">{t("settings")}</Link>
                </>
              )}
              {(user.orgRole === "SUPER_ADMIN" || user.orgRole === "MANAGER" || user.orgRole === "ORG_ADMIN") && (
                <Link className="text-sm text-blue-400 transition hover:text-blue-300 font-semibold" to="/admin">
                  🔐 Admin Panel
                </Link>
              )}
              
              {/* User Info Section */}
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-700">
                <span className="hidden text-sm text-gray-400 sm:block">{user.name}</span>
                
                {/* Organization Badge */}
                {user.organizationId && !user.orgRole?.includes("SUPER_ADMIN") && (
                  <span className="hidden text-xs px-2 py-1 bg-green-900 text-green-200 rounded sm:block" title={`Organization: ${user.organizationId?.name}`}>
                    🏢 Org
                  </span>
                )}
                
                {/* Role Badge */}
                {user.orgRole && (
                  <span className={`hidden text-xs font-bold px-2 py-1 rounded sm:block ${getRoleColor()}`}>
                    {getRoleBadge() || user.orgRole}
                  </span>
                )}
                
                {/* Fallback for old role system */}
                {user.orgRole && (
                  <span className={`hidden text-xs font-bold px-2 py-1 rounded sm:block ${getRoleColor()}`}>
                    {getRoleBadge() || user.orgRole}
                  </span>
                )}
              </div>
              
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
