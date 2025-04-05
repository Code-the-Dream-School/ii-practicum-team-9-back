const express = require("express");
const router = express.Router();
const {
  findUserByEmail,
  validateOTP,
  resetPassword,
} = require("../controllers/resetPassword");

router.get("/", findUserByEmail);
router.get("/validateCode", validateOTP);
router.patch("/:id", resetPassword);

module.exports = router;
