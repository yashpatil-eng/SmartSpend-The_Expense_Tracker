import express from "express";
import { getAIInsights } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/insights", getAIInsights);

export default router;
