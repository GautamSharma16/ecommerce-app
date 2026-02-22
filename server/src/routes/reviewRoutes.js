import express from 'express';
import { addReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/:productId', protect, addReview);

export default router;
