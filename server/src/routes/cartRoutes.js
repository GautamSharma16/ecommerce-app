import express from 'express';
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/', fetchCart);
router.post('/', addToCart);
router.put('/item', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/', clearCart);

export default router;
