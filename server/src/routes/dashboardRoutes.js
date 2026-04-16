import express from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { notAdminOnly } from "../middleware/notAdminMiddleware.js";

const router = express.Router();

router.get("/summary", protect, notAdminOnly, getDashboardSummary);

export default router;
