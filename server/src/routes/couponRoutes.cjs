const express = require("express");
const { body } = require("express-validator");

const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} = require("../controllers/couponController.cjs");

const { protect } = require("../middleware/auth.cjs");
const { admin } = require("../middleware/admin.cjs");

const router = express.Router();

// 🌐 Public route (apply coupon)
router.post("/apply", applyCoupon);

// 🔐 Admin routes
router.use(protect, admin);

// 📥 Get all coupons
router.get("/", getCoupons);

// ➕ Create coupon
router.post(
  "/",
  [
    body("code")
      .notEmpty()
      .withMessage("Coupon code is required")
      .trim(),
    body("discountValue")
      .isNumeric()
      .withMessage("Discount value must be a number"),
    body("expiryDate")
      .isISO8601()
      .withMessage("Valid expiry date is required"),
  ],
  createCoupon
);

// ✏️ Update coupon
router.put("/:id", updateCoupon);

// ❌ Delete coupon
router.delete("/:id", deleteCoupon);

// ✅ Export
module.exports = router;