import express from "express";
import { createMyWork, getMyWork, getMyWorkById, updateMyWork, deleteMyWork } from "../controllers/MyWorkController.js";

const router = express.Router();

router.get('/my-work', getMyWork);
router.get('/my-work/:id', getMyWorkById);
router.post('/my-work', createMyWork);
router.patch('/my-work/:id', updateMyWork);
router.delete('/my-work/:id', deleteMyWork);

export default router;