const authenticateVendor = (req, res, next) => {
  console.log(req.user.role);
  const role = req.user.role;
  if (!role || role != "vendor") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized role",
    });
  }
  next();
};

module.exports = { authenticateVendor };
