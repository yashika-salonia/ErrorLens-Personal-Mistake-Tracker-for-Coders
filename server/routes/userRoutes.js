const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  changePassword,
} = require("../controllers/userController")

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
router.get("/me", auth, getMyProfile);
router.put("/me", auth, updateMyProfile);
router.put("/me/password", auth, changePassword);

module.exports = router;
