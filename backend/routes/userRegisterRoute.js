import express from "express";
import multer from "multer"
import User from "../modules/userModule.js";
import path from "path";


const router = express.Router();

// Storing the file with filename
const storage = multer.diskStorage({
  destination: "./uploads/profilePhotos",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter
});


router.post("/submit", upload.single("image"), async (req, res) => {
  const { name, email, password, DateOfBirth, Phone } = req.body;
  const imagePath = `/uploads/profilePhotos/${req.file.filename}`;

  try {
    
    // Check if user already exists
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
      Role_ID: 1, 
      Name: name,
      Email: email,
      workingID: null,
      Password: hashedPassword,
      Image: imagePath,
      First_Login: true,
      DateOfBirth: DateOfBirth || null,
      Phone: Phone
    });


    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: newUser.User_ID
    })
  } 
  
  catch (error) {
    console.log("Error in route ")
    console.error("Error:", error);
    // res.status(500).json({ error: "Internal server error" });
  }
});

export default router;