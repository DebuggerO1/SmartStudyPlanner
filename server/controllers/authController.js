const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ===============================
   TOKEN HELPERS
================================ */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "20min" } // 🔐 short lived
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // 🔐 long lived
  );
};

/* ===============================
   REGISTER
================================ */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    // 🔑 Access token only (no refresh on signup)
    const accessToken = generateAccessToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* ===============================
   LOGIN
================================ */
exports.login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // 🍪 SET REFRESH TOKEN COOKIE
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,        // ✅ localhost ke liye false
    sameSite: "lax",      // ✅ VERY IMPORTANT
    maxAge: rememberMe
      ? 7 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    token: accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};


/* ===============================
   REFRESH TOKEN
================================ */
exports.refreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // ✅ NOW SAFE

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
          { id: decoded.id },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );

        res.json({ token: newAccessToken });
      }
    );
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   LOGOUT
================================ */
exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
