const DeploymentHistoryModel = require("../models/deploymentHistory");
const User = require("../models/userModel.js");

// Register User
const createDeployment = async (req, res) => {
  const { content, farcasterId } = req.body;
  try {
    if (!content?.domainList?.length || !content?.taskId || !farcasterId) {
      return res
        .status(400)
        .json({ message: "Domain List, TaskId and farcasterId are required" });
    }

    const userExists = await User.findOne({ farcasterId: farcasterId });
    if (userExists) {
      const newRecord = new DeploymentHistoryModel({
        domainList: content?.domainList,
        taskId: content?.taskId,
        createdBy: userExists?._id,
      });
      await newRecord.save();
      res.status(201).json({ message: "Deployment registered successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Fail to save history! User not found " });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// Login User
const getAllUserDeployments = async (req, res) => {
  try {
    const { farcasterId } = req.params;

    const userExists = await User.findOne({ farcasterId: farcasterId });
    if (userExists) {
      const records = await DeploymentHistoryModel.find({
        createdBy: userExists?._id,
      }).populate("createdBy");
      if (!records)
        return res.status(400).json({ message: "No records found" });
      res.status(200).json({ records });
    } else {
      return res.status(404).json({ message: "User not found " });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

module.exports = {
  createDeployment,
  getAllUserDeployments,
};
