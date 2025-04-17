const express = require("express");
const upload = require("../middleware/upload");  
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const router = express.Router();

 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// PATCH /api/users/:id/profile-photo
router.patch("/:id/profile-photo", upload.single("photo"), async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

     
    const result = await cloudinary.uploader.upload(req.file.path);

     
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Profile photo updated",
      user: updatedUser,
      profilePhotoUrl: result.secure_url,  
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    res.status(500).json({ message: "Error uploading profile photo" });
  }
});

module.exports = router;
