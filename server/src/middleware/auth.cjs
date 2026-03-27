const jwt = require("jsonwebtoken");
const User = require("../models/User.cjs");

const jwtSecret =
  process.env.JWT_SECRET || "dev-secret-change-in-production";

// 🔐 Protected route (login required)
const protect = async (req, res, next) => {
  let token =
    req.cookies?.token ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "Not authorized. Please login.",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found." });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized. Token invalid.",
    });
  }
};

// 🔓 Optional auth (login optional)
const optionalAuth = async (req, res, next) => {
  let token =
    req.cookies?.token ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = await User.findById(decoded.id).select("-password");
  } catch (err) {}

  next();
};

// ✅ EXPORT
module.exports = {
  protect,
  optionalAuth,
};