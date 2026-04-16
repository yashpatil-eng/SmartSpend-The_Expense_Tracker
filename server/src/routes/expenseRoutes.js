import express from "express";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { notAdminOnly } from "../middleware/notAdminMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(notAdminOnly);

router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
