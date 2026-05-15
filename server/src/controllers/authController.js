import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";
import { isSuperAdminEmail } from "../config/admins.js";

const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

const sanitizeUser = (user) => {
  const sanitized = {
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    accountRole: user.accountRole,
    organizationName: user.organizationName,
    gstNumber: user.gstNumber,
    avatar: user.avatar,
    onboardingCompleted: user.onboardingCompleted,
    isActive: user.isActive,
    // Multi-tenant fields
    orgRole: user.orgRole,
    organizationId: user.organizationId,
    budget: user.budget,
    budgetPeriod: user.budgetPeriod
  };
  // ✅ DEBUG: Log user type and role
  console.log(`[DEBUG] User: ${sanitized.email}, accountRole: ${sanitized.accountRole}, orgRole: ${sanitized.orgRole}`);
  return sanitized;
};

const validateRegistration = (payload) => {
  const { accountRole, password, email, name, organizationName, ownerName } = payload;

  if (!accountRole || !["personal", "organization"].includes(accountRole)) {
    return "Please choose a valid account type";
  }
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (accountRole === "personal") {
    if (!name || !email) return "Full name and email are required for personal accounts";
  }
  if (accountRole === "organization") {
    if (!organizationName || !ownerName || !email) {
      return "Organization name, owner name and business email are required";
    }
  }
  // ✅ SECURITY: Block SUPER_ADMIN email from public registration
  if (email.toLowerCase() === "admin@gmail.com") {
    return "This email is reserved for admin only. Contact system administrator.";
  }
  return null;
};

export const register = async (req, res) => {
  try {
    const validationError = validateRegistration(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const {
      accountRole,
      password,
      email,
      name,
      fullName,
      ownerName,
      organizationName,
      gstNumber
    } = req.body;

    const normalizedEmail = email.toLowerCase();
    const existingByEmail = await User.findOne({ email: normalizedEmail });
    if (existingByEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const resolvedName = accountRole === "organization" ? ownerName : name || fullName;

    // ✅ SECURITY: Regular users should NEVER have SUPER_ADMIN role
    // orgRole remains null for all regular signups
    const user = await User.create({
      name: resolvedName,
      email: normalizedEmail,
      password: hashedPassword,
      mobile: normalizedMobile,
      accountRole: accountRole,
      orgRole: null, // ✅ Always null for regular users - no admin role
      organizationName: accountRole === "organization" ? organizationName : undefined,
      gstNumber: accountRole === "organization" ? gstNumber : undefined
    });

    return res.status(201).json({
      user: sanitizeUser(user),
      token: generateToken(user._id, "user")
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already in use`;
      return res.status(409).json({ message });
    }
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();

    // ✅ CHECK SUPER_ADMIN FIRST (hardcoded credentials)
    if (normalizedEmail === "admin@gmail.com" && password === "Admin@123") {
      return res.json({
        user: {
          id: "super-admin",
          name: "System Administrator",
          email: "admin@gmail.com",
          orgRole: "SUPER_ADMIN",
          accountRole: "personal"
        },
        token: generateToken("super-admin", "SUPER_ADMIN")
      });
    }

    // ✅ IF NOT SUPER_ADMIN, check database for regular users
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Use Google or Mobile login for this account" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ DEBUG: Log user info before returning
    console.log(`[DEBUG] Login successful for: ${user.email}`);
    console.log(`[DEBUG] accountRole: ${user.accountRole}, orgRole: ${user.orgRole}`);

    return res.json({
      user: sanitizeUser(user),
      token: generateToken(user._id, "user") // ✅ Role "user" in token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

export const googleAuth = async (req, res) => {
  try {
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("req.body:", req.body);

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log("payload:", payload);

    if (!payload?.email) {
      return res.status(400).json({ message: "Google account email is unavailable" });
    }

    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }]
    });

    if (!user) {
      const normalizedEmail = payload.email.toLowerCase();
      
      // ⚠️ SECURITY: Block admin@gmail.com from Google OAuth signup
      if (normalizedEmail === "admin@gmail.com") {
        return res.status(400).json({ 
          message: "admin@gmail.com cannot be created via OAuth. Use standard login." 
        });
      }
      
      // ✅ SECURITY: Google users are NEVER SUPER_ADMIN
      // All Google OAuth users are regular users with orgRole=null
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: normalizedEmail,
        googleId: payload.sub,
        avatar: payload.picture,
        orgRole: null, // ✅ Always null - no admin role for OAuth users
        accountRole: "personal"
      });
      console.log(`[DEBUG] Google user created: ${normalizedEmail}, orgRole: null`);
    } else {
      let dirty = false;
      if (!user.googleId) {
        user.googleId = payload.sub;
        dirty = true;
      }
      if (!user.avatar && payload.picture) {
        user.avatar = payload.picture;
        dirty = true;
      }
      if (dirty) {
        await user.save();
      }
    }

    return res.json({
      user: sanitizeUser(user),
      token: generateToken(user._id, "user") // ✅ Always "user" role
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed. Please try again." });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("organizationId", "name orgCode");
    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Me endpoint error:", error);
    return res.json({ user: sanitizeUser(req.user) });
  }
};
