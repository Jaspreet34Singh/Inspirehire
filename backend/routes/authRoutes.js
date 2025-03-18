import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../modules/userModule.js";

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
            { id: user.User_ID, name: user.Name, role: user.Role_ID },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            user: { id: user.User_ID, name: user.Name, role: user.Role_ID },
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
