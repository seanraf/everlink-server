const User = require("../models/userModel");

// Register User
const registerUser = async (req, res) => {
  const { id, username, email, provider } = req.body;
  try {
    console.log({
      username,
      id,
      email,
      provider,
    });
    if (!provider) {
      return res.status(400).json({ message: "Provider is required" });
    }

    let userExists;

    if (provider === "farcaster") {
      if (!id || !username) {
        return res
          .status(400)
          .json({ message: "id and username are required" });
      }
      userExists = await User.findOne({ id });
      if (userExists)
        return res
          .status(409)
          .json({ message: "Farcaster user already exists" });

      const newUser = new User({ id, username, provider });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "Farcaster user registered successfully" });
    }

    if (provider === "gmail") {
      if (!id || !email) {
        return res
          .status(400)
          .json({ message: "gmailId and email are required" });
      }
      userExists = await User.findOne({ id });
      if (userExists)
        return res.status(409).json({ message: "Gmail user already exists" });

      const newUser = new User({ id, email, provider });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "Gmail user registered successfully" });
    }

    res.status(400).json({ message: "Unsupported provider" });
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
