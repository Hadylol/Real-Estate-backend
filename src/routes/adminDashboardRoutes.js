const express = require("express");

const {
  getUser,
  getUsers,
  getVendors,
} = require("../controllers/adminDashboardController");

const router = express.Router();

router.get("/get-user/:username", getUser);
router.get("/get-users", getUsers); //getting client

router.get("/get-vendors", getVendors);

module.exports = router;
