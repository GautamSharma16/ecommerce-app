const Coupon = require("../models/Coupon.cjs");

// 📦 Get all coupons (Admin)
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort("-createdAt");
    res.json(coupons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ➕ Create coupon (Admin)
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, usageLimit } =
      req.body;

    const existing = await Coupon.findOne({ code });

    if (existing) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
    });

    res.status(201).json(coupon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update coupon (Admin)
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const {
      code,
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
      isActive,
    } = req.body;

    if (code) coupon.code = code;
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (expiryDate) coupon.expiryDate = expiryDate;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();

    res.json(coupon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete coupon (Admin)
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🎯 Apply coupon (User)
const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({
      code,
      isActive: true,
    });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon" });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    const finalTotal = Math.max(cartTotal - discount, 0);

    // increment usage
    coupon.usedCount += 1;
    await coupon.save();

    res.json({
      success: true,
      discount,
      finalTotal,
      coupon: coupon.code,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ EXPORT
module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};