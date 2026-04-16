import { useState } from "react";
import { BarChart3, Users, CreditCard, Shield, LogOut } from "lucide-react";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminUserManagement from "../components/admin/AdminUserManagement";
import AdminTransactionManagement from "../components/admin/AdminTransactionManagement";
import AdminManagement from "../components/admin/AdminManagement";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "management", label: "Admin Management", icon: Shield },
    { id: "users", label: "Users", icon: Users },
    { id: "transactions", label: "Transactions", icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <p className="text-sm text-gray-400 mt-1">SmartSpend</p>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-zinc-800"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-zinc-800">
            <div className="bg-zinc-800 rounded p-4 mb-3">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-900 hover:bg-red-800 text-red-100 rounded transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {activeTab === "dashboard" && <AdminDashboard />}
            {activeTab === "management" && <AdminManagement />}
            {activeTab === "users" && <AdminUserManagement />}
            {activeTab === "transactions" && <AdminTransactionManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
