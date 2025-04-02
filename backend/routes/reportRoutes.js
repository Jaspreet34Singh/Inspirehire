
import express from "express";
import {
  generateApplicationSummary,
  generateQualifiedCandidatesReport
} from "../Controllers/reportController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only accessible by Admin (role = 1)
router.get("/applications-summary", authenticate, authorize([1]), generateApplicationSummary);
router.get("/qualified-candidates", authenticate, authorize([1]), generateQualifiedCandidatesReport);

export default router;
