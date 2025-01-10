import express from "express";
import {
  signup,
  verifyEmail,
  sendVerificationCode,
} from "../controllers/auth_controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/send-verification-code", sendVerificationCode);
router.post("/verify-email", verifyEmail);

export default router;
