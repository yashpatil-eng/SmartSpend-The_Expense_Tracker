import express from "express";
import { getAIInsights } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { notAdminOnly } from "../middleware/notAdminMiddleware.js";

const router = express.Router();
router.use(protect);
router.use(notAdminOnly);

router.get("/insights", getAIInsights);

export default router;
