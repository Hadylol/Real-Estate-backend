const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  console.log("this is the token", token);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: `Unauthorized token` });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    req.user = user;
    next();
  });
};
module.exports = { authenticate };
