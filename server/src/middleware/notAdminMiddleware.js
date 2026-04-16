/**
 * ✅ Not Admin Middleware
 * Prevents admin users from accessing regular user-specific endpoints
 * Admin must use dedicated /admin/* endpoints instead
 */
export const notAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ✅ Block admin users
  if (req.user.role === "admin" || req.user._id === "admin") {
    return res.status(403).json({ 
      message: "Admin users cannot access user endpoints. Use /admin/* endpoints instead." 
    });
  }

  next();
};

export default notAdminOnly;
