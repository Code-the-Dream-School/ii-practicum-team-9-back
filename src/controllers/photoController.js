const UserProfile = require("../models/UserProfile");

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: "No file uploaded. Please make sure to send the image with the field name 'image' in form-data" 
      });
    }

    const userId = req.user._id;
    const photoUrl = req.file.secure_url || req.file.url || req.file.path;

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: { profilePhoto: photoUrl } },
      { new: true }
    ).populate("user", "-password");

    res.status(200).json({ 
      message: "Profile photo uploaded successfully",
      data: updatedProfile
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    res.status(500).json({ message: "Error uploading profile photo" });
  }
};

module.exports = { uploadProfilePhoto };
