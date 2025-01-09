import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateTokenAndSetCookie = (res, userID) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    //max age 7days
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
