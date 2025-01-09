const mongoose = require("mongoose");

const DeploymentHistorySchema = new mongoose.Schema(
  {
    domainList: [String],
    taskId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    url: {
      type: String,
    },
    arweaveUrl: {
      type: String,
    },
    customUrl: {
      type: String,
    },
    shortUrlId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Page = mongoose.model("deployment_history", DeploymentHistorySchema);
module.exports = Page;
