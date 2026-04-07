import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import twilio from "twilio";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;
const otpStore = new Map();
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const normalizeMobile = (mobile = "") => mobile.replace(/\D/g, "");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
  role: user.role,
  organizationName: user.organizationName,
  gstNumber: user.gstNumber,
  avatar: user.avatar,
  onboardingCompleted: user.onboardingCompleted
});

const validateRegistration = (payload) => {
  const { role, password, email, mobile, name, organizationName, ownerName } = payload;

  if (!role || !["personal", "organization"].includes(role)) {
    return "Please choose a valid account type";
  }
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (!mobile || normalizeMobile(mobile).length < 10) {
    return "A valid mobile number is required";
  }
  if (role === "personal") {
    if (!name || !email) return "Full name and email are required for personal accounts";
  }
  if (role === "organization") {
    if (!organizationName || !ownerName || !email) {
      return "Organization name, owner name and business email are required";
    }
  }
  return null;
};

export const register = async (req, res) => {
  const validationError = validateRegistration(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const {
    role,
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
  const resolvedName = role === "organization" ? ownerName : name || fullName;

  const user = await User.create({
    name: resolvedName,
    email: normalizedEmail,
    password: hashedPassword,
    mobile: normalizedMobile,
    role,
    organizationName: role === "organization" ? organizationName : undefined,
    gstNumber: role === "organization" ? gstNumber : undefined
  });

  return res.status(201).json({
    user: sanitizeUser(user),
    token: generateToken(user._id)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

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

  return res.json({
    user: sanitizeUser(user),
    token: generateToken(user._id)
  });
};

export const googleAuth = async (req, res) => {
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
    user = await User.create({
      name: payload.name || payload.email.split("@")[0],
      email: payload.email.toLowerCase(),
      googleId: payload.sub,
      avatar: payload.picture,
      role: "personal"
    });
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
    token: generateToken(user._id)
  });
};

export const sendOtp = async (req, res) => {
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
    await twilioClient.messages.create({
      to: `+${normalizedMobile}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: `Your SmartSpend OTP is ${otp}. It expires in ${Math.floor(otpTtlMs / 60000)} minutes.`
    });
  }

  const response = { message: "OTP sent successfully" };
  if (process.env.NODE_ENV !== "production") {
    response.devOtp = otp;
  }

  return res.json(response);
};

export const verifyOtp = async (req, res) => {
  const normalizedMobile = normalizeMobile(req.body.mobile);
  const otp = req.body.otp;
  const role = req.body.role || "personal";
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
      if (!user.role) user.role = role;
      await user.save();
    } else {
      user = await User.create({
        name: name || `User ${normalizedMobile.slice(-4)}`,
        email: email ? email.toLowerCase() : undefined,
        mobile: normalizedMobile,
        role
      });
    }
  }

  return res.json({
    user: sanitizeUser(user),
    token: generateToken(user._id)
  });
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};
