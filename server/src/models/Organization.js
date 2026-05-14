import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    orgCode: { type: String, required: true, unique: true, trim: true, uppercase: true },
    inviteLink: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    description: { type: String, trim: true, default: "" },
    logo: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// ✅ NOTE: orgCode already has index from "unique: true" constraint
// Only explicit index for createdBy for faster lookups
organizationSchema.index({ createdBy: 1 });

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
