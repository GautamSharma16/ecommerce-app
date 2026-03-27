const express = require("express");

const {
  uploadImage,
  uploadMultiple,
} = require("../controllers/uploadController.cjs");

const { protect } = require("../middleware/auth.cjs");
const { admin } = require("../middleware/admin.cjs");
const { upload } = require("../middleware/upload.cjs");

const router = express.Router();

// 🔐 Admin protected routes
router.use(protect, admin);

// 📤 Upload single image
router.post("/single", upload.single("image"), uploadImage);

// 📤 Upload multiple images
router.post("/multiple", upload.array("images", 10), uploadMultiple);

// ✅ Export
module.exports = router;