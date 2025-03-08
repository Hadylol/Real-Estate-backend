const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authenticateVendor = (req, res, next) => {
  const role = req.params;
  if (role != promoteur) {
  }
  next();
};

module.exports = { authenticateVendor };
