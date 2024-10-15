const User = require("../models/userModel");
const UserLinks = require("../models/linksModel");

// Register User
const curateLinks = async (req, res) => {
  const { links, theme, googleAnalyticsTag, createdBy } = req.body;
  console.log(
    "🚀 ~ curateLinks ~ links, theme, googleAnalyticsTag:",
    links,
    theme,
    googleAnalyticsTag
  );
  try {
    if (!links || links.length === 0) {
      return res.status(400).json({ message: "Links are required" });
    }
    const userExists = await User.findOne({ _id: createdBy });
    if (userExists) {
      const newRecord = new UserLinks({
        links,
        theme,
        googleAnalyticsTag,
        createdBy,
      });
      await newRecord.save();
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(500).json({ message: "User does not exist", err });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// Login User
const getAllUserLinks = async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await UserLinks.find({
      createdBy: userId,
    }).populate("createdBy");
    if (!records) return res.status(400).json({ message: "No records found" });

    res.status(200).json({ records });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

module.exports = {
  curateLinks,
  getAllUserLinks,
};
