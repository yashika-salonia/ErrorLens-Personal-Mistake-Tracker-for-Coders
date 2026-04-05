const jwt = require("jsonwebtoken");
const User = require("../models/User");

// generate jwt
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, codingLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required. ",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      codingLevel,
    });

    res.status(201).json({
      success: true,
      message: "Registeration successful. ",
      user,
      token: signToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    // Select password back in (hidden by default via toJSON)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    res.json({
      success: true,
      message: "Login successful.",
      token: signToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get user profile
const getMyProfile = async (req, res) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// update profile
const updateMyProfile = async (req, res) => {
  try {
    const ALLOWED = ["name", "codingLevel", "role"];
    const updates = {};

    ALLOWED.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update. ",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    res.json({ success: true, message: "Profile updated.", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both currentPassword and newPassword are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect." });
    }

    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    res.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  changePassword,
};
