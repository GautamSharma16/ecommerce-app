import express from 'express';
import { uploadImage, uploadMultiple } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.use(protect, admin);
router.post('/single', upload.single('image'), uploadImage);
router.post('/multiple', upload.array('images', 10), uploadMultiple);

export default router;
