import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../modules/userModule.js";
import { authenticate } from "../middleware/authMiddleware.js";


const router = express.Router();

// Login API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { Email: email } });

        if (!user) return res.status(401).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.User_ID, email: user.Email, role: user.Role_ID },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

        res.json({
            message: "Login successful",
            user: { id: user.User_ID,
                name: user.Name,
                role: user.Role_ID,
                email: user.Email,
                First_Login: user.First_Login },
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/change-password", authenticate, async (req, res) => {
    const userId = req.user?.id;
  
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID missing." });
    }
    
    console.log("🔐 Changing password for user ID:", userId);

    const { newPassword } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update(
        {
          Password: hashedPassword,
          First_Login: false,
        },
        {
          where: { User_ID: userId },
        }
      );
  
      res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (err) {
      console.error("Password update error:", err);
      res.status(500).json({ success: false, message: "Failed to update password." });
    }
  });

export default router;
