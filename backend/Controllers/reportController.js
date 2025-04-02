import { Op, fn, col, literal } from "sequelize";
import JobPost from "../modules/job.model.js";
import Application from "../modules/application.model.js";
import Category from "../modules/jobCategory.model.js";
import AIScreening from "../modules/aiScreening.model.js";

export const generateApplicationSummary = async (req, res) => {
    try {
      const { month, year } = req.query;
  
      if (!year) {
        return res.status(400).json({ message: "Year is required" });
      }
  
      const startDate = new Date(`${year}-${month || "01"}-01`);
      const endDate = new Date(startDate);
  
      if (month) {
        endDate.setMonth(startDate.getMonth() + 1);
      } else {
        endDate.setFullYear(startDate.getFullYear() + 1);
      }
  
      const data = await Category.findAll({
        attributes: [
          "Category_ID",
          "Category_Name",
          [fn("COUNT", col("JobPosts.JOB_ID")), "jobCount"],
          [fn("COUNT", literal("DISTINCT `JobPosts->Applications`.`Application_ID`")), "applicationCount"],
        ],
        include: [
          {
            model: JobPost,
            attributes: [],
            where: {
              Posted_Date: {
                [Op.gte]: startDate,
                [Op.lt]: endDate,
              },
            },
            include: [
              {
                model: Application,
                as: "Applications",
                attributes: [],
              },
            ],
          },
        ],
        group: ["JobCategory.Category_ID"],
        order: [[literal("applicationCount"), "DESC"]],
      });
  
      res.status(200).json({ success: true, summary: data });
    } catch (err) {
      console.error("📊 Report generation error:", err);
      res.status(500).json({ success: false, message: "Failed to generate report", error: err.message });
    }
  };
  

  export const generateQualifiedCandidatesReport = async (req, res) => {
    try {
      const { month, year } = req.query;
  
      if (!year) {
        return res.status(400).json({ message: "Year is required" });
      }
  
      const startDate = new Date(`${year}-${month || "01"}-01`);
      const endDate = new Date(startDate);
  
      if (month) {
        endDate.setMonth(startDate.getMonth() + 1);
      } else {
        endDate.setFullYear(startDate.getFullYear() + 1);
      }
  
      const jobs = await JobPost.findAll({
        where: {
          Posted_Date: {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          },
        },
        include: [
          {
            model: Application,
            include: [
              {
                model: AIScreening,
                attributes: ["Screening_Decision"],
              },
            ],
          },
        ],
      });
  
      const result = jobs.map((job) => {
        const totalApplicants = job.Applications.length;
  
        const qualifiedCount = job.Applications.filter((app) =>
          app.AIScreenings?.some(screen => screen.Screening_Decision === "true")
        ).length;
  
        let difficulty = "Very Hard";
        let difficultyScore = 4;
  
        const ratio = totalApplicants === 0 ? 0 : qualifiedCount / totalApplicants;
  
        if (ratio >= 0.8) {
          difficulty = "Easy";
          difficultyScore = 1;
        } else if (ratio >= 0.5) {
          difficulty = "Moderate";
          difficultyScore = 2;
        } else if (ratio >= 0.2) {
          difficulty = "Hard";
          difficultyScore = 3;
        }
  
        return {
          jobId: job.JOB_ID,
          title: job.Job_Title,
          totalApplicants,
          qualifiedApplicants: qualifiedCount,
          difficulty,
          difficultyScore,
        };
      });
  
      result.sort((a, b) => a.difficultyScore - b.difficultyScore);
  
      const finalReport = result.map(({ difficultyScore, ...rest }) => rest);
  
      res.status(200).json({ success: true, report: finalReport });
    } catch (err) {
      console.error("📊 Qualified report error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to generate report",
        error: err.message,
      });
    }
  };
  