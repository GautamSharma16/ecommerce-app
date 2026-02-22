import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-razorpay', protect, verifyRazorpayPayment);
export default router;
