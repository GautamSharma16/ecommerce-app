const express = require("express");

const {
  getProducts,
  getProductBySlug,
  getProductById,
  getCategories,
} = require("../controllers/productController.cjs");

const { optionalAuth } = require("../middleware/auth.cjs");

const router = express.Router();

// 📦 Get all products (optional auth)
router.get("/", optionalAuth, getProducts);

// 📂 Get categories
router.get("/categories", getCategories);

// 🔗 Get product by slug
router.get("/slug/:slug", getProductBySlug);

// 🔍 Get product by ID
router.get("/:id", getProductById);

// ✅ Export
module.exports = router;