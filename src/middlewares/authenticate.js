const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  console.log("this is the token", token);
  if (!token) {
    return res.status(401).json({ success: false, message: `Unauthorized` });
  }
  next();
};
module.exports = { authenticate };
