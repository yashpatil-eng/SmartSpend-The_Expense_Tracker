import express from "express";
import { deleteUser, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.put("/update", updateUser);
router.delete("/delete", deleteUser);

export default router;
