import express from 'express';
import { body } from 'express-validator';
import {
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
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { getProductById } from '../controllers/productController.js';
import { refundRazorpayPayment } from '../controllers/paymentController.js';

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

export default router;
