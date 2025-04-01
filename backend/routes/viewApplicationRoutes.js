import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { getHRApplications } from "../Controllers/viewApplicationController.js";

const router = express.Router();

// Only HRs can view their applications
router.get("/", authenticate, authorize([2]), getHRApplications);

export default router;
