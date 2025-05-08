 
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadProfilePhoto } = require("../controllers/photoController");
const authenticateUser = require("../middleware/authentication");

router.post(
  "/upload-profile-photo",
  authenticateUser,
  upload.single("image"),
  uploadProfilePhoto
);

module.exports = router;
