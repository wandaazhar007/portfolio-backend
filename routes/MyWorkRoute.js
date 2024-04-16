import express from "express";
import { createMyWork, getMyWork, getMyWorkById, updateMyWork, deleteMyWork } from "../controllers/MyWorkController.js";

const router = express.Router();

router.get('/api/my-work', getMyWork);
router.get('/api/my-work/:id', getMyWorkById);
router.post('/api/my-work', createMyWork);
router.patch('/api/my-work/:id', updateMyWork);
router.delete('/api/my-work/:id', deleteMyWork);

export default router;