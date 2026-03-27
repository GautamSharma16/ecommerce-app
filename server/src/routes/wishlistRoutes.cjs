const express = require("express");

const {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController.cjs");

const { protect } = require("../middleware/auth.cjs");

const router = express.Router();

// 🔐 Protect all wishlist routes
router.use(protect);

// ❤️ Get wishlist
router.get("/", fetchWishlist);

// ➕ Add to wishlist
router.post("/", addToWishlist);

// ❌ Remove from wishlist
router.delete("/:productId", removeFromWishlist);

// ✅ Export
module.exports = router;