const express = require("express");

const { addReview } = require("../controllers/reviewController.cjs");
const { protect } = require("../middleware/auth.cjs");

const router = express.Router();

// ⭐ Add review
router.post("/:productId", protect, addReview);

// ✅ Export
module.exports = router;