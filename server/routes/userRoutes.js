const express = require("express");
const router = express.Router();
const { asyncHandler } = require('../middleware/asyncHandler');
const { protect } = require('../middleware/authMiddleware');

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/userController");


router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.get("/profile", protect, asyncHandler(getProfile));
router.get("/test", asyncHandler(async (req, res, next) => {
  res.json({ msg: "asyncHandler works!" });
}));

module.exports = router;
