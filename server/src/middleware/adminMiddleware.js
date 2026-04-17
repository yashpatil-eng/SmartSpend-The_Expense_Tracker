/**
 * ✅ Admin Middleware - SUPER_ADMIN Only
 * Checks if user has SUPER_ADMIN role (system-level admin)
 * Only SUPER_ADMIN can access global admin dashboard
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Only SUPER_ADMIN can access global admin features
  if (req.user.orgRole !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Access denied. SUPER_ADMIN only." });
  }

  next();
};
