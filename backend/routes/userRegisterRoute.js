import express from "express";
import { checkEmail, hashPassword, enterData } from "../modules/userModule.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  const { Name, Email, password, Image, DateOfBirth, Phone } = req.body;

  try {
    // Check if email exists
    const noDuplicateEmail = await checkEmail(Email);
    if (!noDuplicateEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user into database
    await enterData(Name, Email, hashedPassword, Image, DateOfBirth, Phone);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
