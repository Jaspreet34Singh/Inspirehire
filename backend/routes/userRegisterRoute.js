import express from "express";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";
import User from "../modules/userModule.js";

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: "./uploads/profilePhotos",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// File filter for image validation
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

// ✅ Fix: Ensure request validation
router.post("/submit", upload.single("image"), async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);  // 

    const { name, email, password, DateOfBirth, Phone } = req.body;
    if (!name || !email || !password || !Phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    //  Fix: Handle missing file (Avoid `req.file.filename` error)
    const imagePath = req.file ? `/uploads/profilePhotos/${req.file.filename}` : "default.png";

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const newUser = await User.create({
      Role_ID: 2, 
      Name: name.trim(),
      Email: email.trim(),
      workingID: null,
      Password: hashedPassword,
      Image: imagePath,
      First_Login: true,
      DateOfBirth: DateOfBirth || null,
      Phone: Phone.trim()
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: newUser.User_ID
    });
  } catch (error) {
    console.error("Error in route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
