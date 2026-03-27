const jwt = require("jsonwebtoken");
const User = require("../models/User.cjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { validationResult } = require("express-validator");

const jwtSecret =
  process.env.JWT_SECRET || "dev-secret-change-in-production";

const generateToken = (id) =>
  jwt.sign({ id }, jwtSecret, { expiresIn: "30d" });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

// ✅ REGISTER
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered." });

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions).status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ LOGIN
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ME
const getMe = async (req, res) => {
  res.json(req.user);
};

// ✅ UPDATE PROFILE
const updateProfile = async (req, res) => {
  const { name, address, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(name && { name }),
      ...(address && { address }),
      ...(phone && { phone }),
    },
    { new: true }
  );

  res.json(user);
};

// ✅ LOGOUT
const logout = (req, res) => {
  res.cookie("token", "", { maxAge: 0 }).json({ message: "Logged out." });
};

// 🔥 FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  const message = `Reset your password: ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500).json({ message: "Email not sent" });
  }
};

// 🔥 RESET PASSWORD
const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};

// ✅ EXPORT ALL
module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
};