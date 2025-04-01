import express from "express";
import { createHRAccount } from "../Controllers/adminController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Only Admins can create HR accounts
router.post("/create-hr", authenticate, authorize([1]), createHRAccount);

export default router;
