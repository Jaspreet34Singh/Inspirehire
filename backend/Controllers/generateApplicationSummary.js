import { Op, fn, col, literal } from "sequelize";
import JobPost from "../modules/job.model.js";
import Application from "../modules/application.model.js";
import Category from "../modules/category.model.js"; // Assuming you have this

export const generateApplicationSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    // Fetch job categories with job count and application count
    const data = await Category.findAll({
      attributes: [
        "Category_ID",
        "Category_Name",
        [
          fn("COUNT", col("JobPosts.JOB_ID")),
          "jobCount"
        ],
        [
          fn("COUNT", col("JobPosts.Applications.Application_ID")),
          "applicationCount"
        ]
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
              attributes: [],
            },
          ],
        },
      ],
      group: ["Category.Category_ID"],
      order: [[literal("applicationCount"), "DESC"]],
    });

    res.status(200).json({ success: true, summary: data });
  } catch (error) {
    console.error('Error generating application summary:', error);
    res.status(500).json({ success: false, message: 'Failed to generate application summary', error: error.message });
  }
};
