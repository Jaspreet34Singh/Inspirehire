import JobPost from "../modules/job.model.js";
import JobCategory from "../modules/jobCategory.model.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";
import Application from "../modules/application.model.js";

// POST /jobs/categories
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Category name is required." });
    }

    // Check for duplicates (case-insensitive)
    const existing = await JobCategory.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("Category_Name")),
        name.toLowerCase()
      )
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "Category name already exists." });
    }

    const category = await JobCategory.create({ Category_Name: name });
    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error("❌ Error creating category:", error);
    res.status(500).json({ success: false, message: "Failed to create category", error: error.message });
  }
};

// PUT /jobs/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Category name is required." });
    }

    const category = await JobCategory.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Check if another category already has the same name (case-insensitive)
    const existing = await JobCategory.findOne({
      where: {
        Category_Name: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("Category_Name")),
          name.toLowerCase()
        ),
        Category_ID: { [Op.ne]: categoryId } // exclude self
      }
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "Another category with this name already exists." });
    }

    category.Category_Name = name;
    await category.save();

    res.status(200).json({ success: true, message: "Category updated", category });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    res.status(500).json({ success: false, message: "Failed to update category", error: error.message });
  }
};


//  Get all job categories
export const getJobCategories = async (req, res) => {
  try {
    console.log("Fetching job categories...");

    const categories = await JobCategory.findAll();

    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: "No job categories found" });
    }

    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching job categories", error: error.message });
  }
};

//  Delete Job Category

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await JobCategory.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await category.destroy();

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    res.status(500).json({ success: false, message: "Failed to delete category", error: error.message });
  }
};




//  Get all jobs
export const getAllJobs = async (req, res) => {
  try {
      const jobs = await JobPost.findAll({
          where: {
              Job_Deadline: { [Op.gt]: new Date() } // Only fetch jobs where deadline is in the future
          },
          include: [
              { 
                  model: JobCategory,  
                  as: "JobCategory",
                  attributes: ["Category_Name"]
              }
          ]
      });

      res.json({ success: true, jobs });
  } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching jobs", error: error.message });
  }
};

export const deleteJobPostById = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await JobPost.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await job.destroy();
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    res.status(500).json({ success: false, message: "Error deleting job", error: error.message });
  }
};

//  Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await JobPost.findByPk(req.params.id, 
        {
            include: [
                { 
                  model: JobCategory,  
                  as: JobCategory,
                  attributes: ["Category_Name"]
                }       
              ]
        }
    );
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching job", error: error.message });
  }
};

// Create a new Job Post (Only for HR - Role_ID: 2)
export const createJobPost = async (req, res) => {
  try {
    console.log("🔹 Incoming Job Post Request:", req.body);

    const {
      title,
      category,
      jobType,
      location,
      MinEducationLevel,
      MinFieldRelatedExp,
      salary,
      description,
      deadline
    } = req.body;

    const hrEmail = req.user.email; // ✅ Get email from token
    console.log("🟢 HR Email:", hrEmail);


    if (!hrEmail) {
      return res.status(400).json({ success: false, message: "HR email not found in token" });
    }

    const newJob = await JobPost.create({
      USER_ID: req.user.id,
      Category_ID: category,
      Job_Title: title,
      Job_Type: jobType,
      Job_Location: location,
      Job_Contact_Email: hrEmail, 
      MinEducationLevel,
      MinFieldRelatedExp,
      Salary: salary,
      Job_Description: description,
      Job_Deadline: deadline,
      Posted_Date: new Date()
    });

    res.status(201).json({ success: true, message: "Job posted successfully!", job: newJob });
  } catch (error) {
    console.error("🔴 Job creation error:", error);
    res.status(500).json({ success: false, message: "Backend Error creating job", error: error.message });
  }
};

export const updateJobPost = async (req, res) => {
  console.log("🛠️ PUT /jobs/edit/:id triggered");
  console.log("➡️ Job ID:", req.params.id);
  console.log("📦 Payload:", req.body);

  try {
    const jobId = req.params.id;

    const updated = await JobPost.update(
      {
        Job_Title: req.body.title,
        Category_ID: req.body.category,
        Job_Type: req.body.jobType,
        Job_Location: req.body.location,
        MinEducationLevel: req.body.MinEducationLevel,
        MinFieldRelatedExp: req.body.MinFieldRelatedExp,
        Salary: req.body.salary,
        Job_Description: req.body.description,
        Job_Deadline: req.body.deadline,
      },
      {
        where: { JOB_ID: jobId },
      }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ success: false, message: "No job found to update" });
    }

    res.json({ success: true, message: "Job updated successfully" });
  } catch (error) {
    console.error("🔥 Error updating job:", error);
    res.status(500).json({ success: false, message: "Failed to update job", error: error.message });
  }
};



// Get jobs posted by the logged-in HR
export const getHRJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobs = await JobPost.findAll({
      where: { USER_ID: userId },
      include: [
        {
          model: JobCategory,
          attributes: ["Category_Name"]
        }
      ],
      order: [["Posted_Date", "DESC"]]
    });

    res.status(200).json({
      success: true,
      jobs
    });

  } catch (error) {
    console.error("Error fetching HR jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch HR jobs",
      error: error.message
    });
  }
};

