import express from "express";
import {
  signup,
  verifyEmail,
  sendVerificationCode,
  login,
  logout,
  forgetPassword,
  resetPassword,
} from "../controllers/auth_controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validateToken } from "../middlewares/validateResetToken.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", validateToken, resetPassword);
router.post("/send-verification-code", authenticate, sendVerificationCode);
router.post("/verify-email", verifyEmail);

export default router;
