import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/VerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
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
    const updatedUser = await userModel.updateUserVerified(
      true,
      null,
      null,
      user.user_id,
    );
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: `User Verifed successfully !`,
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
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

export const login = async (req, res) => {};
export const logout = async (req, res) => {};
