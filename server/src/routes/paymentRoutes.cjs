const express = require("express");

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController.cjs");

const { protect } = require("../middleware/auth.cjs");

const router = express.Router();

// 💳 Create Razorpay order
router.post("/create-razorpay-order", protect, createRazorpayOrder);

// ✅ Verify payment
router.post("/verify-razorpay", protect, verifyRazorpayPayment);

// ✅ Export
module.exports = router;