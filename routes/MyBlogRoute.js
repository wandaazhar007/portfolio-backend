import express from "express";
import { createBlog, getAllBlog, getMyBlog, updateMyBlog, getButtonCategory, deleteMyBlog } from "../controllers/MyBlogController.js";

const router = express.Router();

router.get('/my-blog', getMyBlog);
router.get('/my-blog-per-category', getButtonCategory);
router.get('/my-blog-all', getAllBlog);
// router.get('/my-blog/:id', getMyBlogById);
router.post('/my-blog', createBlog);
router.patch('/my-blog/:id', updateMyBlog);
router.delete('/my-blog/:id', deleteMyBlog);

export default router;