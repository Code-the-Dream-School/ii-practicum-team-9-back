const express = require("express");
const router = express.Router();
const {
  findUserByEmail,
  validateOTP,
  resetPassword,
} = require("../controllers/resetPassword");

router.post("/", findUserByEmail);
router.post("/validateCode/", validateOTP);
router.patch("/", resetPassword);

module.exports = router;
