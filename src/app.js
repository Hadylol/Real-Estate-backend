// server.js
import express from "express";
import authRoutes from "./routes/auth_routes.js";

const app = express();

//parse the req.body
app.use(express.json());

app.use("/api/auth/", authRoutes);

export default app;
