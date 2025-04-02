import express from "express";
import Application from "../modules/application.model.js";
import JobPost from "../modules/job.model.js";

const router = express.Router();

router.get("/applications/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("user id from view application route "+ userId)
    const applications = await Application.findAll({
      include: [{ model: JobPost }],
    });
    res.json(applications);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

export default router;