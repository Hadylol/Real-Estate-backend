const { userModel } = require("../models/userModel.js");

const getUser = async (req, res) => {
  const { username } = req.params;
  console.log(`this is the userID ${username}`);
  res.status(200).json({
    success: true,
    message: "this route is working ",
  });
};

const getUsers = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.status(200).json({
    success: true,
    message: "this route is working",
    users: users,
  });
};
const getVendors = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "we go all vendor",
  });
};

module.exports = { getUser, getUsers, getVendors };
