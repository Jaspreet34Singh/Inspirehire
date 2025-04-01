import { getUserInformation, postApplicationData } from "../Controllers/ApplicationController.js";
import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure Multer storage with dynamic folder selection
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "uploads/Other/";

        if (file.fieldname === "resume") {
            folder = "uploads/Resume/";
        } else if (file.fieldname === "coverLetter") {
            folder = "uploads/CoverLetter/";
        }

        // Ensure the directory exists before saving the file
        fs.mkdirSync(folder, { recursive: true });

        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Configure Multer upload
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log("Received file:", file);
        cb(null, true);
    }
});

router.get("/:id", authenticate, authorize([3]), getUserInformation);

router.post(
    "/submit",
    authenticate,
    authorize([3]),
    upload.fields([
        { name: "resume", maxCount: 1 },
        { name: "coverLetter", maxCount: 1 }
    ]),
    postApplicationData
);


export default router;
