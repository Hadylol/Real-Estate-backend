import { userModel } from "../models/userModel.js";

export const validateToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) {
      res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }
    const user = await userModel.getUserByPasswordToken(token);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Invalid or expired Token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occured during Token validation",
    });
  }
};
