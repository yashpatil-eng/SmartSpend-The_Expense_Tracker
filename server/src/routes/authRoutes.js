import express from "express";
<<<<<<< HEAD
import { googleAuth, login, me, register } from "../controllers/authController.js";
=======
import { googleAuth, login, me, register, sendOtp, verifyOtp, sendEmailOtp, verifyEmailOtp } from "../controllers/authController.js";
>>>>>>> 41b76b951fba95f6d9dbdbd747ff0db1e2305ec3
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
<<<<<<< HEAD
=======
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);
>>>>>>> 41b76b951fba95f6d9dbdbd747ff0db1e2305ec3
router.get("/me", protect, me);

export default router;
