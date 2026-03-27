const express = require("express");

const {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController.cjs");

const { protect } = require("../middleware/auth.cjs");

const router = express.Router();

// 🔐 Protect all routes
router.use(protect);

router.get("/", fetchCart);
router.post("/", addToCart);
router.put("/item", updateCartItem);
router.delete("/item/:itemId", removeFromCart);
router.delete("/", clearCart);

// ✅ Export
module.exports = router;