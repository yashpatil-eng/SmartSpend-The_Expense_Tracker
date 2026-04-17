import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Handle SUPER_ADMIN token (id = "super-admin", role = "SUPER_ADMIN")
    if (decoded.id === "super-admin" && decoded.role === "SUPER_ADMIN") {
      req.user = {
        _id: "super-admin",
        id: "super-admin",
        name: "System Administrator",
        email: "admin@gmail.com",
        role: "user", // Kept as "user" for backward compatibility
        orgRole: "SUPER_ADMIN", // ✅ Set orgRole for middleware checks
        accountRole: "personal",
        mobile: "",
        organizationName: "",
        gstNumber: "",
        avatar: "",
        onboardingCompleted: true,
        isActive: true
      };
      return next();
    }

    // ✅ Handle regular user tokens (lookup from database)
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
