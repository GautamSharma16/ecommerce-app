import express from 'express';
import { body } from 'express-validator';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getCategories);

router.post(
    '/',
    protect,
    admin,
    [
        body('name').notEmpty().withMessage('Category name is required').trim(),
    ],
    createCategory
);

router.put('/:id', protect, admin, updateCategory);

router.delete('/:id', protect, admin, deleteCategory);

export default router;
