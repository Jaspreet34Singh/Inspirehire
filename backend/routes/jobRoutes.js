import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import {
  getAllJobs,
  getJobById,
  createJobPost,
  getJobCategories,
  getHRJobs,
  updateJobPost,
  createCategory,
  deleteCategory,
  updateCategory,
  deleteJobPostById
} from "../Controllers/jobController.js";  // Import controllers

const router = express.Router();

//  Route: Get all job categories
router.get("/categories", getJobCategories);

//  Route: Create a new category
router.post("/categories", authenticate, authorize([1]), createCategory);

// DELETE category (Admin only)
router.delete("/categories/:id", authenticate, authorize([1]), deleteCategory);

// UPDATE category (Admin only)
router.put("/categories/:id", authenticate, authorize([1]), updateCategory);

//  Route: Get all jobs
router.get("/", getAllJobs);

//  Admin: delete job post by id
router.delete("/:id", authenticate, authorize([1]), deleteJobPostById);

// Get jobs posted by current HR
router.get("/hr", authenticate, authorize([2]), getHRJobs);

//  Route: Get job by ID
router.get("/:id", getJobById);

// Update Job Post by ID (Only HR)
router.put("/edit/:id", authenticate, authorize([2]), updateJobPost);


// Route: Create a job post (Only HR - Role_ID: 2)
router.post("/create", authenticate, authorize([2]), createJobPost);



export default router;
