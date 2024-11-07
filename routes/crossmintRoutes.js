const express = require("express");
const { mintNFT } = require("../controllers/crossmintController");
const router = express.Router();

router.post("/mintNFT", mintNFT);

module.exports = router;
