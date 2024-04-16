import express from 'express';
import { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } from '../controllers/CategoryController.js';

const router = express.Router();

router.get('/api/category', getCategory);
router.get('/api/category/:id', getCategoryById);
router.post('/api/category', createCategory);
router.patch('/api/category/:id', updateCategory);
router.delete('/api/category/:id', deleteCategory)

export default router;