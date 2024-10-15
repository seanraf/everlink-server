const express = require("express");
const {
  curateLinks,
  getAllUserLinks,
} = require("../controllers/linksController");
const router = express.Router();

router.post("/curate-list", curateLinks);
router.get("/user/:userId", getAllUserLinks);

module.exports = router;
