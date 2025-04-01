import Application from "../modules/application.model.js";
import User from "../modules/userModule.js";
import JobPost from "../modules/job.model.js";

// Get all applications for jobs posted by this HR
export const getHRApplications = async (req, res) => {
  try {
    const hrId = req.user.id;

    // Get all jobs posted by the HR
    const jobs = await JobPost.findAll({ where: { USER_ID: hrId } });
    const jobIds = jobs.map((job) => job.JOB_ID);

    if (jobIds.length === 0) {
      return res.json({ success: true, applications: [] }); // No jobs = no apps
    }

    const applications = await Application.findAll({
      where: { Job_ID: jobIds },
      include: [
        {
          model: User,
          attributes: ["User_ID", "Name", "Email", "Phone"]
        },
        {
          model: JobPost,
          attributes: ["Job_Title"]
        }
      ]
    });

    const modifiedApps = applications.map(app => {
        const appJson = app.toJSON();
        appJson.Resume_Link = app.Resume_FilePath 
          ? `http://localhost:3000/${app.Resume_FilePath}` 
          : null;
        appJson.CoverLetter_Link = app.CoverLetter_FilePath 
          ? `http://localhost:3000/${app.CoverLetter_FilePath}` 
          : null;
        return appJson;
      });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("🔴 Error in getHRApplications:", error);
    res.status(500).json({ success: false, message: "Error fetching applications", error: error.message });
  }
};
