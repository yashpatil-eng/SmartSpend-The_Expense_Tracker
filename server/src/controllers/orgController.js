import crypto from "crypto";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const resolveOrganizationId = (req, targetUser = null) => {
  if (req.user.orgRole === "SUPER_ADMIN") {
    return req.body.organizationId || req.query.organizationId || req.query.orgId || targetUser?.organizationId || req.user.organizationId || null;
  }
  return req.user.organizationId;
};

const verifySameOrganization = (req, targetUser) => {
  if (!targetUser || !targetUser.organizationId) return false;
  if (req.user.orgRole === "SUPER_ADMIN") return true;
  return targetUser.organizationId.toString() === req.user.organizationId?.toString();
};

// Utility to generate unique org code
const generateOrgCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "ORG-";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Utility to generate invite link
const generateInviteLink = (orgCode) => {
  return `/join/org/${orgCode}`;
};

// 🆕 Regular users: Create personal organization
export const createPersonalOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Organization name is required" });
    }

    // Check if user is already part of an organization
    if (req.user.organizationId) {
      return res.status(400).json({ message: "You are already part of an organization. Leave it first to create a new one." });
    }

    // Generate unique org code and invite link
    let orgCode = generateOrgCode();
    let codeExists = await Organization.findOne({ orgCode });
    
    while (codeExists) {
      orgCode = generateOrgCode();
      codeExists = await Organization.findOne({ orgCode });
    }

    const inviteLink = generateInviteLink(orgCode);

    const organization = await Organization.create({
      name: name.trim(),
      orgCode,
      inviteLink,
      createdBy: req.user._id,
      admins: [req.user._id],
      users: [req.user._id],
      description: description || "",
      isActive: true
    });

    // Update user with organization ID
    await User.findByIdAndUpdate(req.user._id, {
      organizationId: organization._id
    });

    console.log(`[DEBUG] ✓ Organization created: ${organization.name} (${orgCode}) by ${req.user.email}`);

    res.status(201).json({
      message: "Organization created successfully",
      organization: {
        _id: organization._id,
        name: organization.name,
        orgCode: organization.orgCode,
        inviteLink: organization.inviteLink,
        createdBy: organization.createdBy,
        admins: organization.admins,
        users: organization.users,
        description: organization.description
      }
    });
  } catch (error) {
    console.error("Create personal organization error:", error);
    res.status(500).json({ message: "Error creating organization" });
  }
};

// SUPER_ADMIN: Create organization
export const createOrganization = async (req, res) => {
  try {
    // Verify user is SUPER_ADMIN
    if (req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Only SUPER_ADMIN can create organizations" });
    }

    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Organization name is required" });
    }

    // Generate unique org code and invite link
    let orgCode = generateOrgCode();
    let codeExists = await Organization.findOne({ orgCode });
    
    while (codeExists) {
      orgCode = generateOrgCode();
      codeExists = await Organization.findOne({ orgCode });
    }

    const inviteLink = generateInviteLink(orgCode);

    const organization = await Organization.create({
      name: name.trim(),
      orgCode,
      inviteLink,
      createdBy: req.user._id,
      admins: [req.user._id],
      users: [req.user._id],
      description: description || ""
    });

    // Add organization to SUPER_ADMIN's org (if needed for reference)
    await User.findByIdAndUpdate(req.user._id, {
      organizationId: organization._id,
      orgRole: "SUPER_ADMIN"
    });

    res.status(201).json({
      message: "Organization created successfully",
      organization
    });
  } catch (error) {
    console.error("Create organization error:", error);
    res.status(500).json({ message: "Error creating organization" });
  }
};

// SUPER_ADMIN: Get all organizations
export const getAllOrganizations = async (req, res) => {
  try {
    if (req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Only SUPER_ADMIN can view all organizations" });
    }

    const organizations = await Organization.find()
      .populate("createdBy", "name email")
      .populate("admins", "name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "Organizations retrieved successfully",
      count: organizations.length,
      organizations
    });
  } catch (error) {
    console.error("Get all organizations error:", error);
    res.status(500).json({ message: "Error fetching organizations" });
  }
};

// Any user: Get their organization details
export const getMyOrganization = async (req, res) => {
  try {
    if (!req.user.organizationId) {
      return res.status(404).json({ message: "User is not part of any organization" });
    }

    const organization = await Organization.findById(req.user.organizationId)
      .populate("createdBy", "name email")
      .populate("admins", "name email")
      .populate("users", "name email orgRole budget");

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json({
      message: "Organization details retrieved successfully",
      organization
    });
  } catch (error) {
    console.error("Get organization error:", error);
    res.status(500).json({ message: "Error fetching organization" });
  }
};

// User: Join organization via orgCode
export const joinOrganizationByCode = async (req, res) => {
  try {
    const { orgCode } = req.body;

    if (!orgCode || orgCode.trim().length === 0) {
      return res.status(400).json({ message: "Organization code is required" });
    }

    const organization = await Organization.findOne({ orgCode: orgCode.toUpperCase() });

    if (!organization) {
      return res.status(404).json({ message: "Invalid organization code" });
    }

    if (!organization.isActive) {
      return res.status(403).json({ message: "Organization is not active" });
    }

    // Check if user already in organization
    if (req.user.organizationId && req.user.organizationId.toString() === organization._id.toString()) {
      return res.status(400).json({ message: "User already belongs to this organization" });
    }

    // ⚠️ CRITICAL SECURITY: Users joining via org code are ALWAYS regular users
    // They MUST have orgRole: null (no admin access whatsoever)
    // No exceptions, no conditions - joining = regular user only
    
    console.log(`[DEBUG] User ${req.user.email} joining organization ${organization.name} via code`);
    console.log(`[DEBUG] ⚠️ SECURITY: Force setting orgRole to null (NO ADMIN - EVER)`);

    // ✅ Update user with organization - ALWAYS null role for org code joins
    await User.findByIdAndUpdate(req.user._id, {
      organizationId: organization._id,
      orgRole: null  // ⚠️ FORCED: Always null - absolutely NO ADMIN ACCESS
    });

    // ✅ Add user ONLY to users list - NEVER to admins list
    await Organization.findByIdAndUpdate(organization._id, {
      $addToSet: { users: req.user._id }
      // ⚠️ CRITICAL: NO $addToSet for admins - never add to admins list
    });

    console.log(`[DEBUG] ✓ User ${req.user.email} joined as REGULAR USER (orgRole=null)`);

    res.json({
      message: "Successfully joined organization as regular user",
      organization: {
        _id: organization._id,
        name: organization.name,
        orgCode: organization.orgCode
      }
    });
  } catch (error) {
    console.error("Join organization error:", error);
    res.status(500).json({ message: "Error joining organization" });
  }
};

// ORG_ADMIN/MANAGER: Add user to organization (by email and assign role)
export const addUserToOrganization = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "MANAGER" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Only ORG_ADMIN or MANAGER can add users" });
    }

    const { email, assignRole } = req.body;

    const organizationId = resolveOrganizationId(req);
    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required for this action" });
    }

    if (!email || email.trim().length === 0) {
      return res.status(400).json({ message: "Email is required" });
    }

    const validRoles = ["ORG_ADMIN", "MANAGER"];
    if (assignRole && !validRoles.includes(assignRole)) {
      return res.status(400).json({ message: "Invalid role. Must be ORG_ADMIN or MANAGER" });
    }

    const targetUser = await User.findOne({ email: email.toLowerCase() });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const finalRole = assignRole || null;

    // Update user
    await User.findByIdAndUpdate(targetUser._id, {
      organizationId,
      orgRole: finalRole
    });

    // Update organization - manage admins list
    if (finalRole === "ORG_ADMIN" || finalRole === "MANAGER") {
      await Organization.findByIdAndUpdate(organizationId, {
        $addToSet: { admins: targetUser._id, users: targetUser._id }
      });
    } else {
      await Organization.findByIdAndUpdate(organizationId, {
        $addToSet: { users: targetUser._id },
        $pull: { admins: targetUser._id }
      });
    }

    const roleLabel = finalRole || "regular user";

    res.json({
      message: `User added as ${roleLabel}`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        orgRole: finalRole
      }
    });
  } catch (error) {
    console.error("Add user to organization error:", error);
    res.status(500).json({ message: "Error adding user to organization" });
  }
};

// ✅ NEW: SUPER_ADMIN/ORG_ADMIN: Promote user to ORG_ADMIN or MANAGER
export const promoteUserToAdmin = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ 
        message: "Only ORG_ADMIN or SUPER_ADMIN can promote users" 
      });
    }

    const { userId, targetRole } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Default to ORG_ADMIN, but allow SUPER_ADMIN to specify MANAGER
    const roleToAssign = (req.user.orgRole === "SUPER_ADMIN" && targetRole === "MANAGER") ? "MANAGER" : "ORG_ADMIN";

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!verifySameOrganization(req, targetUser)) {
      return res.status(403).json({ message: "User not found in organization" });
    }

    if (!targetUser.organizationId) {
      return res.status(400).json({ message: "Target user must belong to an organization" });
    }

    // Enforce one admin per role per organization
    // If promoting to MANAGER, demote existing MANAGERs
    // If promoting to ORG_ADMIN, demote existing ORG_ADMINs
    const existingAdmins = await User.find({
      organizationId: targetUser.organizationId,
      orgRole: roleToAssign,
      _id: { $ne: targetUser._id }
    });

    if (existingAdmins.length > 0) {
      const existingAdminIds = existingAdmins.map((user) => user._id);
      await User.updateMany({ _id: { $in: existingAdminIds } }, { orgRole: null });
      await Organization.findByIdAndUpdate(targetUser.organizationId, {
        $pull: { admins: { $in: existingAdminIds } }
      });
      
      console.log(`[DEBUG] ✓ Demoted existing ${roleToAssign}: ${existingAdminIds.length} users`);
    }

    // ✅ Update user role to specified role (MANAGER or ORG_ADMIN)
    const updatedUser = await User.findByIdAndUpdate(userId, {
      orgRole: roleToAssign,
      role: "admin"  // Also update legacy role
    }, { new: true }).select("-password");

    // ✅ Add user to organization's admins list
    await Organization.findByIdAndUpdate(targetUser.organizationId, {
      $addToSet: { admins: userId }
    });

    console.log(`[DEBUG] ✓ User promoted to ${roleToAssign}: ${targetUser.email} by ${req.user.email}`);

    res.json({
      message: `User promoted to ${roleToAssign} successfully`,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        orgRole: updatedUser.orgRole,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("Promote user to admin error:", error);
    res.status(500).json({ message: "Error promoting user" });
  }
};

// ✅ NEW: SUPER_ADMIN/ORG_ADMIN: Demote admin to regular user
export const demoteAdminToUser = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ 
        message: "Only ORG_ADMIN or SUPER_ADMIN can demote admins" 
      });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Prevent demoting yourself
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot demote yourself" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser || !verifySameOrganization(req, targetUser)) {
      return res.status(403).json({ message: "User not found in organization" });
    }

    const organizationId = resolveOrganizationId(req, targetUser);
    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    // ✅ Update user role to null (regular user, not admin)
    const updatedUser = await User.findByIdAndUpdate(userId, {
      orgRole: null
    }, { new: true }).select("-password");

    // ✅ Remove user from organization's admins list
    await Organization.findByIdAndUpdate(organizationId, {
      $pull: { admins: userId }
    });

    console.log(`[DEBUG] ✓ User demoted to regular user: ${targetUser.email} by ${req.user.email}`);

    res.json({
      message: "User demoted to regular user successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        orgRole: updatedUser.orgRole,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("Demote admin to user error:", error);
    res.status(500).json({ message: "Error demoting user" });
  }
};

// ORG_ADMIN: Get all users in organization
export const getOrganizationUsers = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "MANAGER" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Only ORG_ADMIN or MANAGER can view users" });
    }

    const organizationId = resolveOrganizationId(req);
    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const users = await User.find({
      organizationId
    }).select("-password").sort({ createdAt: -1 });

    res.json({
      message: "Organization users retrieved successfully",
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Get organization users error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ORG_ADMIN: Set user budget
export const setUserBudget = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "MANAGER" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Only ORG_ADMIN or MANAGER can set budgets" });
    }

    const { userId, budget, budgetPeriod } = req.body;

    if (!userId || budget === undefined) {
      return res.status(400).json({ message: "User ID and budget are required" });
    }

    if (budget < 0) {
      return res.status(400).json({ message: "Budget must be non-negative" });
    }

    const validPeriods = ["weekly", "monthly", "yearly"];
    const period = budgetPeriod && validPeriods.includes(budgetPeriod) ? budgetPeriod : "monthly";

    const targetUser = await User.findById(userId);
    if (!targetUser || !verifySameOrganization(req, targetUser)) {
      return res.status(403).json({ message: "Cannot update user from different organization" });
    }

    await User.findByIdAndUpdate(userId, {
      budget,
      budgetPeriod: period
    }, { new: true });

    res.json({
      message: "User budget updated successfully",
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        budget,
        budgetPeriod: period
      }
    });
  } catch (error) {
    console.error("Set user budget error:", error);
    res.status(500).json({ message: "Error updating budget" });
  }
};

// ORG_ADMIN: Get organization transactions
export const getOrganizationTransactions = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "MANAGER" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Only ORG_ADMIN or MANAGER can view all transactions" });
    }

    const { startDate, endDate, userId, category } = req.query;
    const organizationId = resolveOrganizationId(req);
    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const filter = { organizationId };

    if (userId) {
      const targetUser = await User.findById(userId);
      if (!targetUser || targetUser.organizationId.toString() !== organizationId.toString()) {
        return res.status(403).json({ message: "User not found in organization" });
      }
      filter.userId = userId;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(filter)
      .populate("userId", "name email budget")
      .sort({ date: -1 });

    res.json({
      message: "Organization transactions retrieved successfully",
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error("Get organization transactions error:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

// ORG_ADMIN: Get organization analytics with MongoDB aggregation
export const getOrganizationAnalytics = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "MANAGER" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Only ORG_ADMIN or MANAGER can view analytics" });
    }

    const organizationId = resolveOrganizationId(req);
    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    // ✅ 1. Overall Summary (Total Expenses, Income, Balance)
    const summary = await Transaction.aggregate([
      {
        $match: {
          organizationId
        }
      },
      {
        $facet: {
          expenses: [
            { $match: { type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
          ],
          income: [
            { $match: { type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const totalExpenses = summary[0].expenses[0]?.total || 0;
    const totalIncome = summary[0].income[0]?.total || 0;
    const expenseCount = summary[0].expenses[0]?.count || 0;
    const incomeCount = summary[0].income[0]?.count || 0;

    // ✅ 2. Category-Wise Aggregation (for pie/bar charts)
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          organizationId,
          type: "expense"
        }
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
          percentage: { $sum: 1 }
        }
      },
      {
        $sort: { amount: -1 }
      },
      {
        $limit: 20
      }
    ]);

    // Calculate percentages
    const categoryData = categoryBreakdown.map(cat => ({
      category: cat._id,
      amount: Math.round(cat.amount * 100) / 100,
      count: cat.count,
      percentage: totalExpenses > 0 ? Math.round((cat.amount / totalExpenses) * 10000) / 100 : 0
    }));

    // ✅ 3. Monthly Aggregation (for trend line charts)
    const monthlyTrend = await Transaction.aggregate([
      {
        $match: {
          organizationId
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $limit: 12
      }
    ]);

    // Format monthly data for charts
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = monthlyTrend.map(month => ({
      month: monthNames[month._id.month - 1],
      year: month._id.year,
      expenses: Math.round(month.expenses * 100) / 100,
      income: Math.round(month.income * 100) / 100,
      balance: Math.round((month.income - month.expenses) * 100) / 100,
      count: month.count
    }));

    // ✅ 4. User-Wise Aggregation (for admin overview)
    const userBreakdown = await Transaction.aggregate([
      {
        $match: {
          organizationId
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $group: {
          _id: "$userId",
          userName: { $first: "$userDetails.name" },
          userEmail: { $first: "$userDetails.email" },
          userBudget: { $first: "$userDetails.budget" },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },
          transactionCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          budgetUsage: {
            $cond: [
              { $gt: ["$userBudget", 0] },
              { $round: [{ $multiply: [{ $divide: ["$expenses", "$userBudget"] }, 100] }, 2] },
              0
            ]
          }
        }
      },
      {
        $sort: { expenses: -1 }
      }
    ]);

    const userData = userBreakdown.map(user => ({
      userId: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      expenses: Math.round(user.expenses * 100) / 100,
      income: Math.round(user.income * 100) / 100,
      balance: Math.round((user.income - user.expenses) * 100) / 100,
      budget: user.userBudget,
      budgetUsage: user.budgetUsage,
      budgetRemaining: Math.round((user.userBudget - user.expenses) * 100) / 100,
      transactionCount: user.transactionCount
    }));

    // ✅ 5. Get total users
    const totalUsers = await User.countDocuments({
      organizationId
    });

    // ✅ Return structured JSON for charts
    res.json({
      message: "Organization analytics retrieved successfully",
      analytics: {
        summary: {
          totalExpenses: Math.round(totalExpenses * 100) / 100,
          totalIncome: Math.round(totalIncome * 100) / 100,
          balance: Math.round((totalIncome - totalExpenses) * 100) / 100,
          totalTransactions: expenseCount + incomeCount,
          expenseCount,
          incomeCount,
          totalUsers,
          averageExpensePerUser: totalUsers > 0 ? Math.round((totalExpenses / totalUsers) * 100) / 100 : 0
        },
        categoryBreakdown: categoryData,
        monthlyTrend: monthlyData,
        userBreakdown: userData
      }
    });
  } catch (error) {
    console.error("Get organization analytics error:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

// ORG_ADMIN: Remove user from organization
export const removeUserFromOrganization = async (req, res) => {
  try {
    if (req.user.orgRole !== "ORG_ADMIN" && req.user.orgRole !== "MANAGER" && req.user.orgRole !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Only ORG_ADMIN or MANAGER can remove users" });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const targetUser = await User.findById(userId);
    const organizationId = resolveOrganizationId(req, targetUser);
    if (!targetUser || !verifySameOrganization(req, targetUser)) {
      return res.status(403).json({ message: "Cannot remove user from different organization" });
    }

    // Remove user from organization
    await Organization.findByIdAndUpdate(organizationId, {
      $pull: { users: userId, admins: userId }
    });

    // Clear user's organization
    await User.findByIdAndUpdate(userId, {
      organizationId: null,
      orgRole: null
    });

    res.json({
      message: "User removed from organization successfully"
    });
  } catch (error) {
    console.error("Remove user from organization error:", error);
    res.status(500).json({ message: "Error removing user" });
  }
};
