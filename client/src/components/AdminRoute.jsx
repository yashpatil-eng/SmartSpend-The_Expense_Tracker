import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Check for admin roles (SUPER_ADMIN, MANAGER, or ORG_ADMIN)
  if (user.orgRole !== "SUPER_ADMIN" && user.orgRole !== "MANAGER" && user.orgRole !== "ORG_ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
