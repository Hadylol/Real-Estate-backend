const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const generateTokenAndSetCookie = (res, user) => {
  const token = jwt.sign(
    { userID: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    //max age 7days
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
module.exports = { generateTokenAndSetCookie };
