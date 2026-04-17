import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import OrganizationRoute from "./components/OrganizationRoute";
import { useAuth } from "./hooks/useAuth";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import RegisterPage from "./pages/RegisterPage";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import AdminPage from "./pages/AdminPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import OrgAdminDashboard from "./pages/OrgAdminDashboard";
import JoinOrganization from "./pages/JoinOrganization";

const App = () => {
  const { user } = useAuth();
  const location = useLocation();
  const showAppNavbar = location.pathname !== "/" && !location.pathname.startsWith("/super-admin") && !location.pathname.startsWith("/org-admin");

  // Redirect to appropriate dashboard after login based on role
  const redirectAfterLogin = () => {
    // ✅ SUPER_ADMIN goes to admin dashboard
    if (user?.orgRole === "SUPER_ADMIN") {
      console.log(`[DEBUG] SUPER_ADMIN ${user?.email} redirected to admin dashboard`);
      return <Navigate to="/admin" replace />;
    }
    
    // ✅ MANAGER or ORG_ADMIN goes to organization dashboard
    if (user?.orgRole === "MANAGER" || user?.orgRole === "ORG_ADMIN") {
      console.log(`[DEBUG] ${user?.orgRole} ${user?.email} redirected to org dashboard`);
      return <Navigate to="/org-admin" replace />;
    }
    
    // ✅ Regular users
    // Organization users must have organizationId
    if (user?.accountRole === "organization" && !user?.organizationId) {
      console.log(`[DEBUG] Organization user ${user?.email} redirected to join organization`);
      return <Navigate to="/join-organization" replace />;
    }
    
    // Personal users or org users who already joined go to dashboard
    console.log(`[DEBUG] User ${user?.email} redirected to dashboard`);
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <div className="app-bg">
      {showAppNavbar ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? redirectAfterLogin() : <LoginPage />} />
        <Route path="/register" element={user ? redirectAfterLogin() : <RegisterPage />} />
        
        {/* Multi-tenant routes */}
        <Route path="/join-organization" element={<ProtectedRoute><JoinOrganization /></ProtectedRoute>} />
        <Route path="/super-admin/*" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />
        <Route path="/org-admin/*" element={<ProtectedRoute><OrgAdminDashboard /></ProtectedRoute>} />
        
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              {user?.onboardingCompleted ? <Navigate to="/dashboard" /> : <OnboardingPage />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <OrganizationRoute>
              {!user?.onboardingCompleted ? <Navigate to="/onboarding" /> : <DashboardPage />}
            </OrganizationRoute>
          }
        />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/analytics" element={<OrganizationRoute><Analytics /></OrganizationRoute>} />
        <Route path="/ai-insights" element={<OrganizationRoute><AIInsights /></OrganizationRoute>} />
        <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Routes>
    </div>
  );
};

export default App;
