const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

// health route
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// auth routes
app.use("/api/auth", authRoutes);

// connect database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
