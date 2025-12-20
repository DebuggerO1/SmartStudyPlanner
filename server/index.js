const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// ✅ CORS (Express 4 compatible)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// health route
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
