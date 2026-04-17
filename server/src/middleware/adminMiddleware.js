/**
 * ✅ Admin Middleware
 * Checks if user has admin role (orgRole in multi-tenant system)
 * Admin roles: SUPER_ADMIN, MANAGER, ORG_ADMIN
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Only SUPER_ADMIN, MANAGER, and ORG_ADMIN can access
  if (req.user.orgRole !== "SUPER_ADMIN" && req.user.orgRole !== "MANAGER" && req.user.orgRole !== "ORG_ADMIN") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  next();
};
