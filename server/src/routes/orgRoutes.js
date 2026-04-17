import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isSuperAdmin, isOrgAdmin, authorize, requireOrganization } from "../middleware/roleMiddleware.js";
import {
  createPersonalOrganization,
  createOrganization,
  getAllOrganizations,
  getMyOrganization,
  joinOrganizationByCode,
  addUserToOrganization,
  promoteUserToAdmin,
  demoteAdminToUser,
  getOrganizationUsers,
  setUserBudget,
  getOrganizationTransactions,
  getOrganizationAnalytics,
  removeUserFromOrganization
} from "../controllers/orgController.js";
import { exportTransactionsCSV, exportTransactionsExcel } from "../controllers/exportController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// 🆕 Regular users: Create personal organization
router.post("/create-personal", createPersonalOrganization);

// SUPER_ADMIN routes
router.post("/create", isSuperAdmin, createOrganization);
router.get("/all", isSuperAdmin, getAllOrganizations);

// Organization-level routes
router.get("/my-organization", getMyOrganization);
router.post("/join-by-code", joinOrganizationByCode);

// ORG_ADMIN routes
router.post("/add-user", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), addUserToOrganization);
router.post("/promote-to-admin", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), promoteUserToAdmin);
router.post("/demote-to-user", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), demoteAdminToUser);
router.get("/users", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), getOrganizationUsers);
router.post("/set-budget", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), setUserBudget);
router.get("/transactions", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), getOrganizationTransactions);
router.get("/analytics", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), getOrganizationAnalytics);
router.post("/remove-user", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), removeUserFromOrganization);

// Export routes
router.get("/export/csv", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), exportTransactionsCSV);
router.get("/export/excel", authorize(["ORG_ADMIN", "SUPER_ADMIN"]), exportTransactionsExcel);

export default router;
