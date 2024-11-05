const express = require("express");
const {
  createDeployment,
  getAllUserDeployments,
} = require("../controllers/deploymentHistoryController");
const router = express.Router();

router.post("/create", createDeployment);
router.get("/user/:farcasterId", getAllUserDeployments);

module.exports = router;
