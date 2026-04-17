import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OrganizationRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ SUPER_ADMIN redirects to admin dashboard
  if (user.orgRole === "SUPER_ADMIN") {
    console.log(`[DEBUG] SUPER_ADMIN ${user.email} redirected to admin`);
    return <Navigate to="/admin" replace />;
  }
  
  // ✅ MANAGER or ORG_ADMIN redirects to org dashboard
  if (user.orgRole === "MANAGER" || user.orgRole === "ORG_ADMIN") {
    console.log(`[DEBUG] ${user.orgRole} ${user.email} redirected to org dashboard`);
    return <Navigate to="/org-admin" replace />;
  }
  
  // ✅ Organization users must have joined an organization
  if (user.accountRole === "organization" && !user.organizationId) {
    console.log(`[DEBUG] Organization user ${user.email} needs to join organization`);
    return <Navigate to="/join-organization" replace />;
  }
  
  // ✅ All other users (personal or org with organization) can continue
  console.log(`[DEBUG] User ${user.email} allowed to access organization route`);
  return children;
};

export default OrganizationRoute;
