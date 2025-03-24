import JobPost from "../modules/job.model.js";
import JobCategory from "../modules/jobCategory.model.js";

// ✅ Get all job categories
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

//  Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await JobPost.findAll({
          include: [
            { 
              model: JobCategory,  
              as: JobCategory,
              attributes: ["Category_Name"]
            }
          ]
        });
        res.json({ success: true, jobs });
      } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching jobs", error: error.message });
      }
};

// ✅ Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await JobPost.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching job", error: error.message });
  }
};

// ✅ Create a new Job Post (Only for HR - Role_ID: 2)
export const createJobPost = async (req, res) => {
  try {
    console.log("🔹 Incoming Job Post Request:", req.body);

    const {
      title,
      category,
      jobType,
      location,
      minEduReq,
      minWorkExp,
      salary,
      description,
      deadline,
    } = req.body;

    if (!title || !category || !jobType || !location || !minEduReq || !minWorkExp || !salary || !description || !deadline) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    // Check if the Category Exists
    const categoryExists = await JobCategory.findByPk(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: "Invalid Category ID!" });
    }

    // Ensure HR email is included
    const hrEmail = req.user.email || "default@example.com";

    const newJob = await JobPost.create({
      USER_ID: req.user.id,
      Job_Title: title,
      Category_ID: category,
      Job_Type: jobType,
      Job_Location: location,
      Job_Contact_Email: hrEmail,
      Min_EduReq: minEduReq,
      Min_WorkExp: minWorkExp,
      Salary: salary,
      Job_Description: description,
      Job_Deadline: deadline,
      Posted_Date: new Date(),
    });

    res.status(201).json({ success: true, message: "Job posted successfully!", job: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: "Backend Error creating job", error: error.message });
  }
};
