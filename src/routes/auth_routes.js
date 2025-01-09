import express from "express";
import { signup, verifyEmail } from "../controllers/auth_controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);

export default router;
