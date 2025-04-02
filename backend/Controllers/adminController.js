import User from "../modules/userModule.js";
import bcrypt from "bcrypt";

// Create Admin or HR
export const createUserAccount = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, role, WorkingID } = req.body;
    const image = req.file?.filename;

    if (!name || !email || !phone || !dateOfBirth || !image || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // HR needs WorkingID
    if (Number(role) === 2 && !WorkingID) {
      return res.status(400).json({ message: "WorkingID is required for HR" });
    }

    const existing = await User.findOne({ where: { Email: email } });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await User.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
      Phone: phone,
      DateOfBirth: dateOfBirth,
      Role_ID: Number(role),
      Image: image,
      First_Login: true, 
      ...(Number(role) === 2 && { WorkingID }), // include only if HR
    });

    res.status(201).json({ success: true, message: "User created", userId: user.User_ID });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: "Failed to create user", error: error.message });
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ where: { Email: email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.destroy();

    res.status(200).json({ success: true, message: `User ${email} deleted successfully.` });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ success: false, message: "Failed to delete user", error: err.message });
  }
};