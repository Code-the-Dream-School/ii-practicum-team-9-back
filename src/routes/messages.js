const express = require("express");
const router = express.Router();

const { getMessageByUser } = require("../controllers/messages");

router.get("/", getMessageByUser);

module.exports = router;
