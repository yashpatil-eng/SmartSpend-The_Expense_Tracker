import express from "express";
import { createOrUpdateProfile, getProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { notAdminOnly } from "../middleware/notAdminMiddleware.js";

const router = express.Router();

router.get("/", protect, notAdminOnly, getProfile);
router.post("/", protect, notAdminOnly, createOrUpdateProfile);

export default router;
