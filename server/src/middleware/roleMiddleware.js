// Middleware to check if user is admin (SUPER_ADMIN, MANAGER, or ORG_ADMIN)
export const isAdminRole = (orgRole) => {
  return orgRole === "SUPER_ADMIN" || orgRole === "MANAGER" || orgRole === "ORG_ADMIN";
};

// Middleware to check user roles in RBAC system
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    // ✅ Check if user has required orgRole
    const userRole = req.user.orgRole;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Forbidden - This action requires one of: ${allowedRoles.join(", ")}` 
      });
    }

    next();
  };
};

// Middleware to ensure user belongs to the organization
export const requireOrganization = (req, res, next) => {
  if (!req.user || !req.user.organizationId) {
    return res.status(403).json({ message: "Forbidden - User must belong to an organization" });
  }
  
  next();
};

// Middleware to check if user is SUPER_ADMIN
export const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.orgRole !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Forbidden - Only SUPER_ADMIN can perform this action" });
  }
  
  next();
};

// Middleware to check if user is organization admin (MANAGER or ORG_ADMIN)
export const isOrgAdmin = (req, res, next) => {
  if (!req.user || (req.user.orgRole !== "MANAGER" && req.user.orgRole !== "ORG_ADMIN")) {
    return res.status(403).json({ message: "Forbidden - Only organization admin can perform this action" });
  }
  
  next();
};

// Middleware to verify user belongs to the organization from params
export const verifyOrgAccess = (req, res, next) => {
  const { orgId } = req.params;
  
  if (!req.user || !req.user.organizationId) {
    return res.status(403).json({ message: "Forbidden - User must belong to an organization" });
  }

  if (req.user.organizationId.toString() !== orgId) {
    return res.status(403).json({ message: "Forbidden - Cannot access other organizations" });
  }

  next();
};
