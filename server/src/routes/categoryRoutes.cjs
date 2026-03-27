const express = require("express");
const { body } = require("express-validator");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController.cjs");

const { protect } = require("../middleware/auth.cjs");
const { admin } = require("../middleware/admin.cjs");

const router = express.Router();

// 📥 Get all categories
router.get("/", getCategories);

// ➕ Create category
router.post(
  "/",
  protect,
  admin,
  [
    body("name")
      .notEmpty()
      .withMessage("Category name is required")
      .trim(),
  ],
  createCategory
);

// ✏️ Update category
router.put("/:id", protect, admin, updateCategory);

// ❌ Delete category
router.delete("/:id", protect, admin, deleteCategory);

// ✅ Export
module.exports = router;