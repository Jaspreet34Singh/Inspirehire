import express from "express";
import { checkEmail, hashPassword, enterData } from "../modules/userModule.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  const { name, email, password, image, DateOfBirth, Phone } = req.body;

  try {
    // Check if email exists
    const noDuplicateEmail = await checkEmail(email);
    console.log(noDuplicateEmail)
    if (noDuplicateEmail) {
        console.log("Email already exists")
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user into database
    await enterData(name, email, hashedPassword, image, DateOfBirth, Phone);
    
    res.status(201).json({ message: "User registered successfully!" });
  } 
  
  catch (error) {
    console.log("Error in route ")
    console.error("Error:", error);
    // res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
