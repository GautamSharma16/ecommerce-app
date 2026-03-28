const express = require("express");
const { body, validationResult } = require("express-validator");

const {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController.cjs");

const { protect } = require("../middleware/auth.cjs");

// ✅ Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ✅ Validation rules
const authValidation = {
  register: [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  login: [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  forgotPassword: [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  ],
  resetPassword: [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
};

const router = express.Router();

// 🔐 Auth routes
router.post("/register", authValidation.register, validate, register);
router.post("/login", authValidation.login, validate, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

// 🔑 Password reset
router.post("/forgot-password", authValidation.forgotPassword, validate, forgotPassword);
router.put("/reset-password/:token", authValidation.resetPassword, validate, resetPassword);

// ✅ Export
module.exports = router;
