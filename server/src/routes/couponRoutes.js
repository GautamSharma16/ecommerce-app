import express from 'express';
import { body } from 'express-validator';
import {
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
} from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// Public route to apply coupon
router.post('/apply', applyCoupon);

// Admin routes
router.use(protect, admin);

router.get('/', getCoupons);

router.post(
    '/',
    [
        body('code').notEmpty().withMessage('Coupon code is required').trim(),
        body('discountValue').isNumeric().withMessage('Discount value must be a number'),
        body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
    ],
    createCoupon
);

router.put('/:id', updateCoupon);

router.delete('/:id', deleteCoupon);

export default router;
