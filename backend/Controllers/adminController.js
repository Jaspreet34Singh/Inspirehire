import User from "../modules/userModule.js"
import bcrypt from "bcryptjs";

export const createHRAccount = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth } = req.body;
    const defaultpassword = "password123";
    const existing = await User.findOne({ where: { Email: email } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(defaultpassword, 10);

    const newHR = await User.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
      Phone: phone,
      DateOfBirth: dateOfBirth,
      Role_ID: 2, // HR
      First_Login: true,
      Image: "/uploads/profilePhotos/default.png"
    });

    res.status(201).json({
      success: true,
      message: "HR account created",
      userId: newHR.User_ID,
    });
  } catch (error) {
    console.error("❌ HR creation error:", error);
    res.status(500).json({ success: false, message: "Server error creating HR" });
  }
};
