const jwt = require("jsonwebtoken");
const User = require("../models/User.cjs");
const crypto = require("crypto");

const { validationResult } = require("express-validator");
const sendEmail = require('../models/sendEmail.cjs');

const jwtSecret =
  process.env.JWT_SECRET || "dev-secret-change-in-production";
const emailDebug = String(process.env.EMAIL_DEBUG || "false").toLowerCase() === "true";
const isProd = process.env.NODE_ENV === "production";

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

//  FORGOT PASSWORD


const forgotPassword = async (req, res) => {
  try {
    if (emailDebug) {
      console.log("[auth][forgot-password] Request received", {
        email: req.body?.email,
        frontendUrl: process.env.FRONTEND_URL,
      });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      if (emailDebug) {
        console.warn("[auth][forgot-password] User not found for email:", req.body?.email);
      }
      return res.status(404).json({ success: false, message: 'No user with that email' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    if (emailDebug) {
      console.log("[auth][forgot-password] Generated reset URL for user:", {
        userId: user._id,
        email: user.email,
        resetUrl,
      });
    }

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset</h2>
          <p>You requested a password reset. Click the link below:</p>
          <a href="${resetUrl}" style="
            background: #4F46E5;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
          ">Reset Password</a>
          <p>This link expires in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, ignore this email.</p>
        `,
      });

      res.status(200).json({ success: true, message: 'Email sent successfully' });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      if (emailDebug) {
        console.error('[auth][forgot-password] Email error details:', {
          name: emailError?.name,
          code: emailError?.code,
          response: emailError?.response,
          responseCode: emailError?.responseCode,
          command: emailError?.command,
          stack: emailError?.stack,
        });
      }
      // Clean up token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      let message = "Email could not be sent";
      if (emailError?.code === "EAUTH") {
        message = "SMTP authentication failed. Check SMTP_USER and SMTP_PASS in server/.env";
      } else if (emailError?.code === "EDNS") {
        message = "SMTP host lookup failed. Check SMTP_HOST and your internet/DNS connection";
      } else if (emailError?.code === "ESOCKET" || emailError?.code === "ECONNECTION") {
        message = "SMTP connection failed. Check SMTP_PORT/SMTP_SECURE and network access";
      }

      const response = { success: false, message };
      if (!isProd) {
        response.debug = {
          code: emailError?.code,
          responseCode: emailError?.responseCode,
          response: emailError?.response,
          command: emailError?.command,
        };
      }

      res.status(500).json(response);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

//  RESET PASSWORD
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
