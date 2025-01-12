// server.js
import express from "express";
import authRoutes from "./routes/auth_routes.js";
import cookieParser from "cookie-parser";

const app = express();

//parse the req.body
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/", authRoutes);

export default app;
