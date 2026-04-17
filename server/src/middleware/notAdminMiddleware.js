/**
 * ✅ Not Admin Middleware  
 * Prevents organization admins from accessing regular user transaction endpoints
 * Organization admins should use /org/* endpoints to manage organization-level data
 */
export const notAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ✅ Allow regular users to create transactions
  // Block MANAGER and ORG_ADMIN from using regular transaction endpoints
  if (req.user.orgRole === "MANAGER" || req.user.orgRole === "ORG_ADMIN") {
    return res.status(403).json({ 
      message: "Organization admins should use organization endpoints to manage user transactions" 
    });
  }

  // Allow SUPER_ADMIN (for testing) and regular users
  next();
};

export default notAdminOnly;
