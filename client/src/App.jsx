import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  const { user } = useAuth();
  const location = useLocation();
  const showAppNavbar = location.pathname !== "/";

  return (
    <div className="min-h-screen bg-slate-50">
      {showAppNavbar ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
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
            <ProtectedRoute>
              {!user?.onboardingCompleted ? <Navigate to="/onboarding" /> : <DashboardPage />}
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
