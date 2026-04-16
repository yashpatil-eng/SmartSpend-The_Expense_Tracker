import jwt from "jsonwebtoken";

/**
 * ✅ Generate JWT token with userId and role
 * For admin: userId = "admin", role = "admin"
 * For users: userId = user._id, role = "user"
 */
export const generateToken = (id, role = "user") => 
  jwt.sign(
    { 
      id,        // userId or "admin"
      role       // "admin" | "user"
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: "7d" }
  );
