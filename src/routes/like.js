const express = require("express");
const router = express.Router();

const { likeItem, getLikes } = require("../controllers/like");

router.post("/", likeItem);
router.get("/get-likes/:id", getLikes);

module.exports = router;
