import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true, sparse: true },
    password: { type: String, minlength: 6 },
    mobile: { type: String, unique: true, sparse: true, trim: true },
    // Account type: personal (regular user) or organization (business user)
    accountRole: { type: String, enum: ["personal", "organization"], default: "personal" },
    
    // Multi-tenant roles: SUPER_ADMIN (system), MANAGER/ORG_ADMIN (organization)
    orgRole: { type: String, enum: ["SUPER_ADMIN", "MANAGER", "ORG_ADMIN"], default: null },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
    budget: { type: Number, default: null }, // Monthly budget per user
    budgetPeriod: { type: String, enum: ["weekly", "monthly", "yearly"], default: "monthly" },
    
    // Legacy fields
    organizationName: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String, trim: true },
    preferences: {
      language: { type: String, default: "en" }
    },
    currency: { type: String, default: "INR" },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    onboardingCompleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Indexes for multi-tenant queries
userSchema.index({ organizationId: 1, orgRole: 1 });
userSchema.index({ email: 1, organizationId: 1 });

const User = mongoose.model("User", userSchema);
export default User;
