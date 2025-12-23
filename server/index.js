const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

/* 🔥 VERY IMPORTANT ORDER */
app.use(cors({
  origin:[ "http://localhost:5173", 
    "https://smart-study-planner-eph5.vercel.app"],// frontend
  credentials: true
}));

app.use(express.json());      // 👈 MUST be before routes
app.use(cookieParser());      // 👈 REQUIRED for refreshToken

// health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
