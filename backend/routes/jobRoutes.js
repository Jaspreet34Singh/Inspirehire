import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import {
  getAllJobs,
  getJobById,
  createJobPost,
  getJobCategories
} from "../Controllers/jobController.js";  // Import controllers

const router = express.Router();

//  Route: Get all job categories
router.get("/categories", getJobCategories);

//  Route: Get all jobs
router.get("/", getAllJobs);

//  Route: Get job by ID
router.get("/:id", getJobById);

// Route: Create a job post (Only HR - Role_ID: 2)
router.post("/create", authenticate, authorize([2]), createJobPost);

export default router;
