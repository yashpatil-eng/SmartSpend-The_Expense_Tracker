import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

const JoinOrganization = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [orgCode, setOrgCode] = useState(searchParams.get("code") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ✅ Only organization users without organizationId should see this page
  if (!user) {
    // Not authenticated - redirect to login
    navigate("/login");
    return null;
  }

  if (user?.orgRole === "SUPER_ADMIN") {
    // SUPER_ADMIN goes to admin dashboard
    console.log(`[DEBUG] SUPER_ADMIN cannot access join organization page`);
    navigate("/admin");
    return null;
  }

  if (user?.orgRole === "MANAGER" || user?.orgRole === "ORG_ADMIN") {
    // MANAGER/ORG_ADMIN go to org dashboard
    console.log(`[DEBUG] ${user?.orgRole} cannot access join organization page`);
    navigate("/org-admin");
    return null;
  }

  if (user?.organizationId) {
    // Already in an organization
    console.log(`[DEBUG] User ${user?.email} already in organization, redirecting to dashboard`);
    navigate("/dashboard");
    return null;
  }

  if (user?.accountRole === "personal") {
    // Personal users don't need to join organization
    console.log(`[DEBUG] Personal user ${user?.email} redirected to dashboard`);
    navigate("/dashboard");
    return null;
  }

  const handleJoinOrganization = async (e) => {
    e.preventDefault();
    if (!orgCode.trim()) {
      setError("Please enter an organization code");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post("/org/join-by-code", {
        orgCode: orgCode.toUpperCase()
      });

      setSuccess(true);
      setOrgCode("");
      
      // Refresh user to get updated organization info
      await refreshUser();
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join organization");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Success!</h2>
          <p className="text-gray-300 mb-4">You have successfully joined the organization.</p>
          <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join Organization</h1>
          <p className="text-gray-400">Enter your organization code to join</p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-600 p-4 rounded mb-6 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleJoinOrganization} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Organization Code</label>
            <input
              type="text"
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
              placeholder="e.g., ORG-ABC12"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white text-center font-mono text-lg tracking-widest"
            />
            <p className="text-xs text-gray-400 mt-2">
              You can get this code from your organization administrator
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 rounded font-semibold transition ${
              loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Joining..." : "Join Organization"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-4">
            Don't have an organization code?
          </p>
          <button
            onClick={() => navigate("/register")}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold text-white transition"
          >
            Back to Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinOrganization;
