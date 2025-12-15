const express = require("express");
const { signup, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// 🔒 protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    userId: req.user.id
  });
});

module.exports = router;
