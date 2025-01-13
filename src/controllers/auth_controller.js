import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

import { generateVerificationToken } from "../utils/VerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendForgetPasswordEmail,
  sendPasswordResetSuccess,
} from "../mailtrap/emails.js";
import { userModel } from "../models/userModel.js";
import { fail } from "assert";

export const signup = async (req, res) => {
  const { email, password, name, role } = req.body;
  console.log(email, password, name, role);
  try {
    if (!email || !password || !name || !role) {
      throw new Error("Missing Field !");
    }
    if (!email.includes("@") || !email.includes(".")) {
      throw new Error("Invalid Email");
    }
    if (name.length < 5) {
      throw new Error("Full Name must be atleast 5 characters long");
    }
    if (password.length < 8) {
      //improved later to make the password use diffrent case chara,symbols,numbers...
      throw new Error("Password must be at least 8 characters long");
    }
    const [userAlreadyExists, userNameAlreadyExists] = await Promise.all([
      userModel.getUserByEmail(email),
      userModel.getUserByName(name),
    ]);
    console.log(userAlreadyExists);
    if (Array.isArray(userAlreadyExists) && userAlreadyExists.length != 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists, try another one",
      });
    }
    if (Array.isArray(userNameAlreadyExists) && userNameAlreadyExists != 0) {
      return res.status(400).json({
        success: false,
        message: "Username already Used, try another one",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const { token: verificationToken, expiresAt } = generateVerificationToken();

    const [user] = await userModel.createUser({
      email,
      password: hashPassword,
      role,
      is_verified: false,
      name,
      verification_token: verificationToken,
      verification_token_expiry: expiresAt,
    });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User creation Failed ! ",
      });
    }
    console.log(
      `this is the user instered into db \n ${user.email}${user.name}${user.role}`,
    );
    //generate jwt
    generateTokenAndSetCookie(res, user.user_id);
    await sendVerificationEmail(user.email, verificationToken);
    await res.status(201).json({
      success: true,
      message: "User created!",
      user: {
        email: user.email,
        password: undefined,
        role: user.role,
        is_verified: user.is_verified,
        name: user.name,
        verificationtoken: user.verificationtoken,
        verification_token_expiry: user.verification_token_expiry,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    if (!email) {
      throw new Error("Please provide an Email");
    }
    if (!email.includes("@") || !email.includes(".")) {
      throw new Error("Invalid Email");
    }
    const [user] = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ success: false, message: `User not Found` });
    }
    console.log("is user verified? : ", user.is_verified);
    if (user.is_verified === true) {
      return res.status(400).json({
        success: false,
        message: `User already verified`,
      });
    }
    const { token: verificationToken, expiresAt } = generateVerificationToken();
    const [updatedUser] = await userModel.updateUserVerified(
      false,
      verificationToken,
      expiresAt,
      user.user_id,
    );

    await sendVerificationEmail(updatedUser.email, verificationToken);
    res
      .status(200)
      .json({ success: true, message: `Verification code sent successfuly` });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Something wen wrong while sending the verification code ${error.message}`,
    });
  }
};
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  console.log("this is the code ", code);
  try {
    const user = await userModel.getUserByVerificationCode(code);
    console.log("this is user from auth controller", user);
    if (!user || (Array.isArray(user) && user.length === 0)) {
      console.log("user doesnt exist");
      res.status(404).json({
        success: false,
        message: `Invalid or expired Verificcation code,Please Try Again `,
      });
    }
    console.log("this is the user id", user.user_id);
    const [updatedUser] = await userModel.updateUserVerified(
      true,
      null,
      null,
      user.user_id,
    );
    await sendWelcomeEmail(updatedUser.email, updatedUser.name);
    res.status(200).json({
      success: true,
      message: `User Verifed successfully !`,
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        is_verified: updatedUser.is_verified,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Unable to verify user! ${error.message}`,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await userModel.getUserLogin(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "invalid credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(res, user.user_id);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [user] = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User Not Found !",
      });
    }
    if (!user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Cant reset password Unverified Email",
      });
    }
    //generate reset token :P
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = new Date();
    resetTokenExpire.setHours(resetTokenExpire.getHours() + 1);
    const [updatedUser] = await userModel.updateUserForgetPassword(
      resetToken,
      resetTokenExpire,
      user.user_id,
    );
    //sending reset email
    sendForgetPasswordEmail(
      updatedUser.email,
      `http://${process.env.CLIENT_URL}/api/auth/reset-password/${resetToken}`,
    );
    res.status(200).json({
      success: true,
      message: "password reset link sent to your email!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    console.log(`password : ${password}, Cpassword : ${confirmPassword}`);
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password dont match,try agian...",
      });
    }

    const user = await userModel.getUserByPasswordToken(token);
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expierd Token, Please try again",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);

    const [updatedUser] = await userModel.updateUserPassword(
      hashPassword,
      user.user_id,
    );
    await sendPasswordResetSuccess(updatedUser.email);
    res.status(200).json({
      success: true,
      message: "Password Changed successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
