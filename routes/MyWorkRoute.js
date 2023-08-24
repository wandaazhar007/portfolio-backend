import express from "express";
import { createMyWork, getMyWork, getMyWorkById } from "../controllers/MyWorkController.js";

const router = express.Router();

router.get('/my-work', getMyWork);
router.get('/my-work/:id', getMyWorkById);
router.post('/my-work', createMyWork);

export default router;