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
    
    // ✅ Handle admin token (id = "admin", role = "admin")
    if (decoded.id === "admin" && decoded.role === "admin") {
      req.user = {
        _id: "admin",
        id: "admin",
        name: "Administrator",
        email: "admin@gmail.com",
        role: "admin",
        accountRole: "admin",
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
