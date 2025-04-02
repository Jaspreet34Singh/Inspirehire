import express from "express";
import { createUserAccount } from "../Controllers/adminController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: "./uploads/profilePhotos",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (JPG, PNG, GIF) are allowed!"), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
  fileFilter: fileFilter
});

// ✅ Only Admins can create HR accounts
router.post("/create-user", authenticate, authorize([1]), upload.single("image"), createUserAccount);


export default router;
