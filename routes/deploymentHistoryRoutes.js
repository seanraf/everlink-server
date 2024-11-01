const express = require("express");
const {
  createDeployment,
  getAllUserDeployments,
} = require("../controllers/deploymentHistoryController");
const router = express.Router();

router.post("/create", createDeployment);
router.get("/user/:userId", getAllUserDeployments);

module.exports = router;
