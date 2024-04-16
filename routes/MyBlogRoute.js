import express from "express";
import { createBlog, getAllBlog, getMyBlog, updateMyBlog, getButtonCategory, deleteMyBlog } from "../controllers/MyBlogController.js";

const router = express.Router();

router.get('/api/my-blog', getMyBlog);
router.get('/api/my-blog-per-category', getButtonCategory);
router.get('/api/my-blog-all', getAllBlog);
// router.get('/api/my-blog/:id', getMyBlogById);
router.post('/api/my-blog', createBlog);
router.patch('/api/my-blog/:id', updateMyBlog);
router.delete('/api/my-blog/:id', deleteMyBlog);

export default router;