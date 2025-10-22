const express = require("express");
const {
  createDeployment,
  getAllUserDeployments,
  updateDeploymentUrl,
  getDeploymentsWithTaskId,
} = require("../controllers/deploymentHistoryController");
const router = express.Router();

router.post("/create", createDeployment);
router.get("/user/:farcasterId", getAllUserDeployments);
router.get("/:ipfsTaskId", getDeploymentsWithTaskId);
router.put("/:ipfsTaskId", updateDeploymentUrl);

module.exports = router;
