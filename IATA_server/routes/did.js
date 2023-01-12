const express = require("express");
const { claimVC, requestVC } = require("../controller/did.js");
const router = express.Router();

// http://43.200.166.146:5001/did/claimVC
router.post("/claimVC", claimVC);

// http://43.200.166.146:5001/did/requestVC
router.post("/requestVC", requestVC);

module.exports = router;
