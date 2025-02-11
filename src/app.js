// server.js
const express = require("express");
const authRoutes = require("./routes/auth_routes");
const cookieParser = require("cookie-parser");
const app = express();

//parse the req.body
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/", authRoutes);
module.exports = app;
