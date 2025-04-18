const express = require("express");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const router = express.Router();

const { newBarter, barterAcceptOrDeny } = require("../controllers/barter");

router.post("/newBarter", newBarter);
router.patch("/barter/:id", barterAcceptOrDeny);

module.exports = router;
