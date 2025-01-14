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
router.get("/:taskId", getDeploymentsWithTaskId);
router.put("/:taskId", updateDeploymentUrl);

module.exports = router;
