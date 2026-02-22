import Coupon from '../models/Coupon.js';
import { validationResult } from 'express-validator';

// Get all coupons (Admin)
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort('-createdAt');
        res.json(coupons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Create a new coupon (Admin)
export const createCoupon = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { code, discountType, discountValue, expiryDate, usageLimit, isActive } = req.body;

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            expiryDate,
            usageLimit,
            isActive,
        });
        res.status(201).json(coupon);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Update a coupon (Admin)
export const updateCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, usageLimit, isActive } = req.body;

        if (code) {
            const existing = await Coupon.findOne({ code: code.toUpperCase(), _id: { $ne: req.params.id } });
            if (existing) {
                return res.status(400).json({ message: 'Coupon code already exists' });
            }
        }

        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

        if (code) coupon.code = code.toUpperCase();
        if (discountType) coupon.discountType = discountType;
        if (discountValue !== undefined) coupon.discountValue = discountValue;
        if (expiryDate) coupon.expiryDate = expiryDate;
        if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
        if (isActive !== undefined) coupon.isActive = isActive;

        await coupon.save();

        res.json(coupon);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Delete a coupon (Admin)
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json({ message: 'Coupon deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Apply a coupon (Public/User)
export const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: 'Coupon code is required' });

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(400).json({ message: 'Invalid or inactive coupon' });
        }

        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        res.json({
            _id: coupon._id,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
