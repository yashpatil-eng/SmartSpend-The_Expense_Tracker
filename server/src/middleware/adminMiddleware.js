/**
 * ✅ Admin Middleware
 * Checks if user has admin role (from token)
 * Admin is identified by role = "admin" and id = "admin"
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ✅ Check role from user object
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  next();
};
