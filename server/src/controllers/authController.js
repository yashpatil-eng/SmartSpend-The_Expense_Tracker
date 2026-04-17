import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import twilio from "twilio";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";
import { isSuperAdminEmail } from "../config/admins.js";

const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;
const otpStore = new Map();
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const normalizeMobile = (mobile = "") => mobile.replace(/\D/g, "");

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
  const { accountRole, password, email, mobile, name, organizationName, ownerName } = payload;

  if (!accountRole || !["personal", "organization"].includes(accountRole)) {
    return "Please choose a valid account type";
  }
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (!mobile || normalizeMobile(mobile).length < 10) {
    return "A valid mobile number is required";
  }
  if (accountRole === "personal") {
    if (!name || !email) return "Full name and email are required for personal accounts";
  }
  if (accountRole === "organization") {
    if (!organizationName || !ownerName || !email) {
      return "Organization name, owner name and business email are required";
    }
  }
  // ✅ SECURITY: Block admin email from registering
  if (email.toLowerCase() === "admin@gmail.com") {
    return "This email is reserved for admin use";
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
      mobile,
      name,
      fullName,
      ownerName,
      organizationName,
      gstNumber
    } = req.body;

    const normalizedMobile = normalizeMobile(mobile);

    const existingByMobile = await User.findOne({ mobile: normalizedMobile });
    if (existingByMobile) {
      return res.status(409).json({ message: "Mobile number already in use" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingByEmail = await User.findOne({ email: normalizedEmail });
    if (existingByEmail) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const resolvedName = accountRole === "organization" ? ownerName : name || fullName;

    // ⚠️ SECURITY: Check if registering as SUPER_ADMIN
    const userOrgRole = isSuperAdminEmail(normalizedEmail) ? "SUPER_ADMIN" : null;

    const user = await User.create({
      name: resolvedName,
      email: normalizedEmail,
      password: hashedPassword,
      mobile: normalizedMobile,
      accountRole: accountRole,
      orgRole: userOrgRole, // ✓ SUPER_ADMIN if email matches
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

    // Check database for user
    const user = await User.findOne({ email: email.toLowerCase() });
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
    if (!googleClient || !process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google auth is not configured on server" });
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: "Google account email is unavailable" });
    }

    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }]
    });

    if (!user) {
      const normalizedEmail = payload.email.toLowerCase();
<<<<<<< HEAD
      // ✅ Always "user" for Google auth - admin cannot be created this way
=======
      // ✅ Check if this is the SUPER_ADMIN
      const userOrgRole = isSuperAdminEmail(normalizedEmail) ? "SUPER_ADMIN" : null;
      
>>>>>>> 914ca55a (complete project)
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: normalizedEmail,
        googleId: payload.sub,
        avatar: payload.picture,
<<<<<<< HEAD
        role: "user",
=======
        orgRole: userOrgRole,
>>>>>>> 914ca55a (complete project)
        accountRole: "personal"
      });
      console.log(`[DEBUG] Google user created: ${normalizedEmail}, orgRole: ${userOrgRole}`);
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

export const sendOtp = async (req, res) => {
  try {
    const normalizedMobile = normalizeMobile(req.body.mobile);
    if (!normalizedMobile || normalizedMobile.length < 10) {
      return res.status(400).json({ message: "Please enter a valid mobile number" });
    }

    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpTtlMs = Number(process.env.OTP_TTL_MS || 5 * 60 * 1000);

    otpStore.set(normalizedMobile, {
      otpHash,
      expiresAt: Date.now() + otpTtlMs
    });

    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        console.log(`\n📱 Sending OTP to: +${normalizedMobile}`);
        console.log(`📤 From: ${process.env.TWILIO_PHONE_NUMBER}`);
        const message = await twilioClient.messages.create({
          to: `+${normalizedMobile}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          body: `Your SmartSpend OTP is ${otp}. It expires in ${Math.floor(otpTtlMs / 60000)} minutes.`
        });
        console.log(`✅ OTP sent successfully to ${normalizedMobile} (SID: ${message.sid})\n`);
      } catch (smsError) {
        console.error("\n❌ Twilio SMS send failed:");
        console.error("Error Code:", smsError.code);
        console.error("Error Message:", smsError.message);
        console.error("Full Error:", JSON.stringify(smsError, null, 2));
        console.error("To Number:", `+${normalizedMobile}`);
        console.error("From Number:", process.env.TWILIO_PHONE_NUMBER, "\n");
        return res.status(500).json({ message: "Failed to send OTP via SMS: " + smsError.message });
      }
    } else {
      console.log(`\n🔔 DEVELOPMENT MODE - OTP for ${normalizedMobile}: ${otp}\n`);
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        console.warn("⚠️  Twilio credentials not configured. OTP will only be logged to console.");
      }
    }

    const response = { message: "OTP sent successfully" };
    if (process.env.NODE_ENV !== "production") {
      response.devOtp = otp;
    }

    return res.json(response);
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const normalizedMobile = normalizeMobile(req.body.mobile);
    const otp = req.body.otp;
    const accountRole = req.body.accountRole || "personal";
    const email = req.body.email;
    const name = req.body.name;

    const otpRecord = otpStore.get(normalizedMobile);
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found. Please request a new OTP." });
    }
    if (Date.now() > otpRecord.expiresAt) {
      otpStore.delete(normalizedMobile);
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    const incomingHash = crypto.createHash("sha256").update(String(otp || "")).digest("hex");
    if (incomingHash !== otpRecord.otpHash) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    otpStore.delete(normalizedMobile);

    let user = await User.findOne({ mobile: normalizedMobile });

    if (!user) {
      if (email) {
        user = await User.findOne({ email: email.toLowerCase() });
      }

      if (user) {
        user.mobile = normalizedMobile;
        if (!user.accountRole) user.accountRole = accountRole;
        await user.save();
      } else {
        const normalizedEmail = email ? email.toLowerCase() : undefined;
        // ✅ SECURITY: Role ALWAYS "user" for new OTP signups
        // Admin cannot be created through OTP
        user = await User.create({
          name: name || `User ${normalizedMobile.slice(-4)}`,
          email: normalizedEmail,
          mobile: normalizedMobile,
          role: "user", // ✅ Always "user" for new OTP accounts
          accountRole
        });
      }
    }

    return res.json({
      user: sanitizeUser(user),
      token: generateToken(user._id, "user") // ✅ Always "user" role
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "OTP verification failed. Please try again." });
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
