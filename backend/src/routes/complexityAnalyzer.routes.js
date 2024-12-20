import { Router } from "express";
import { handleComplexityAnalysis } from "../controllers/complexity.controller.js";

const router = Router();
router.post("/analyze", handleComplexityAnalysis);

export default router;