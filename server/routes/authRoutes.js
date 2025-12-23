const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  refreshToken,
  logout
} = require("../controllers/authController");

const router = express.Router();

// ---------- AUTH ROUTES ----------
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// ---------- PROTECTED ROUTE ----------
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    userId: req.user.id
  });
});

module.exports = router;
