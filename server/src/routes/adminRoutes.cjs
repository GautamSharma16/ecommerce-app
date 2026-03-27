const express = require("express");
const { body } = require("express-validator");

const {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetUsers,
  adminUpdateUser,
  adminGetStats,
  adminGetReviews,
  adminDeleteReview,
} = require("../controllers/adminController.cjs");

const { protect } = require("../middleware/auth.cjs");
const { admin } = require("../middleware/admin.cjs");

const { getProductById } = require("../controllers/productController.cjs");
const { refundRazorpayPayment } = require("../controllers/paymentController.cjs");

const router = express.Router();
router.use(protect, admin);

router.get('/stats', adminGetStats);
router.get('/products', adminGetProducts);
router.post('/products', [
  body('name').notEmpty(),
  body('description').notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('category').notEmpty(),
  body('stock').isInt({ min: 0 }),
], adminCreateProduct);
router.get('/products/:id', getProductById);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

router.get('/orders', adminGetOrders);
router.put('/orders/:id', adminUpdateOrderStatus);
router.post('/orders/:id/refund', refundRazorpayPayment);

router.get('/users', adminGetUsers);
router.put('/users/:id', adminUpdateUser);

router.get('/reviews', adminGetReviews);
router.delete('/reviews/:productId/:reviewId', adminDeleteReview);

module.exports= router;
