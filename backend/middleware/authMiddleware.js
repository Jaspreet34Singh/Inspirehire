import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to Authenticate User
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer Token

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid or expired token." });
  }
};

// Middleware to Authorize Specific Roles
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied. You do not have permission." });
    }
    next();
  };
};
