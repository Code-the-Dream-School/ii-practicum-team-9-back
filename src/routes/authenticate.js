const express = require("express");
const router = express.Router();
const { login, register, test } = require("../controllers/authenticate");

router.post("/register", register);
router.post("/login", login);
router.get("/", test);

module.exports = router;
