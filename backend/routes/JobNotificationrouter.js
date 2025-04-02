import express from "express"

import sendNotificationForNewJob from "../Controllers/JobNotificationController.js"

const router = express.Router();

router.post("/new-job/:jobId", sendNotificationForNewJob)

export default router;