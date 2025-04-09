
import User from "../modules/userModule.js";
import SecurityQuestion from "../modules/securityQuestions.model.js";
import bcrypt from "bcrypt";

// Verify security answer
export const verifySecurityAnswer = async (req, res) => {
  const { email, securityAnswer } = req.body;

  try {
    const user = await User.findOne({ where: { Email: email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const question = await SecurityQuestion.findOne({ where: { USER_ID: user.User_ID } });
    if (!question || question.SecurityAnswer !== securityAnswer) {
      return res.status(401).json({ message: "Incorrect security answer" });
    }

    res.status(200).json({ success: true, message: "Security verified" });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { Email: email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ Password: hashed });

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
