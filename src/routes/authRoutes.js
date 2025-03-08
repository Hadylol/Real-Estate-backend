const express = require("express");
const {
  signup,
  verifyEmail,
  sendVerificationCode,
  login,
  logout,
  forgetPassword,
  resetPassword,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authenticate");
const { validateToken } = require("../middlewares/validateResetToken");

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", validateToken, resetPassword);
router.post("/send-verification-code", authenticate, sendVerificationCode);
router.post("/verify-email", verifyEmail);

module.exports = router;
