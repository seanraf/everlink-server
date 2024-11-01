const DeploymentHistoryModel = require("../models/deploymentHistory");

// Register User
const createDeployment = async (req, res) => {
  const { content, createdBy } = req.body;
  try {
    if (!content?.domainList?.length || !content?.taskId) {
      return res
        .status(400)
        .json({ message: "Domain List and TaskId are required" });
    }

    const newRecord = new DeploymentHistoryModel({
      domainList: content?.domainList,
      taskId: content?.taskId,
      createdBy,
    });
    await newRecord.save();
    res.status(201).json({ message: "Deployment registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// Login User
const getAllUserDeployments = async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await DeploymentHistoryModel.find({
      createdBy: userId,
    }).populate("createdBy");
    if (!records) return res.status(400).json({ message: "No records found" });

    res.status(200).json({ records });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

module.exports = {
  createDeployment,
  getAllUserDeployments,
};
