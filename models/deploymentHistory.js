const mongoose = require("mongoose");
const Provider = require("../enums/providerEnum");

const DeploymentHistorySchema = new mongoose.Schema(
  {
    ipfsTaskId: {
      type: String,
      required: true,
    },
    ipfsDomainList: [String],
    arweaveTransactionId: {
      type: String,
    },
    ipfsHash: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
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
    deployed: {
      type: Boolean,
      default: false, // Default value set to false
    },
    provider: {
      type: String,
      enum: Object.values(Provider),
      required: true,
    },
  },
  { timestamps: true }
);

const DeploymentHistory = mongoose.model(
  "deployment_history",
  DeploymentHistorySchema
);
module.exports = DeploymentHistory;
