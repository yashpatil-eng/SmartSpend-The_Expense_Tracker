import express from "express";
import { getAnalyticsCharts, getAnalyticsSummary } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { notAdminOnly } from "../middleware/notAdminMiddleware.js";

const router = express.Router();
router.use(protect);
router.use(notAdminOnly);

router.get("/summary", getAnalyticsSummary);
router.get("/charts", getAnalyticsCharts);

export default router;
