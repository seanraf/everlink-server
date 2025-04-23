const User = require("../models/userModel");

// Register User
const registerUser = async (req, res) => {
  const { fid, username } = req.body;
  try {
    console.log({
      fid,
      username,
    });
    if (!fid || !username) {
      return res.status(400).json({ message: "fid and username are required" });
    }
    const userExists = await User.findOne({ farcasterId: fid });
    if (userExists)
      return res.status(409).json({ message: "User already exists" });

    const newUser = new User({ farcasterId: fid, username });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// Login User
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.status(400).json({ message: "No users found" });

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
};
