const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController.cjs");

const { protect } = require("../middleware/auth.cjs");

const router = express.Router();

// 🔐 Protect all routes
router.use(protect);

// ➕ Create order
router.post("/", createOrder);

// 📥 Get user orders
router.get("/", getMyOrders);

// 🔍 Get single order
router.get("/:id", getOrderById);

// ✅ Export
module.exports = router;