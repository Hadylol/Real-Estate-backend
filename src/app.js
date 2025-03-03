// server.js
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const vendorDashboardRoutes = require("./routes/vendorDashboardRoutes");
const cookieParser = require("cookie-parser");
const app = express();

//parse the req.body
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/", authRoutes);
app.use("/api/admin-Dashboard/", adminDashboardRoutes);
app.use("/api/vendor-Dashboard/", vendorDashboardRoutes);
module.exports = app;
