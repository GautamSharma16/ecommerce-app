import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getCategories,
} from '../controllers/productController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();
router.get('/', optionalAuth, getProducts);
router.get('/categories', getCategories);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

export default router;
