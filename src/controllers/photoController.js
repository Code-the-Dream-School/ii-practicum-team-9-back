const UserProfile = require("../models/UserProfile");

const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { profilePhoto: req.file.path },
      { new: true, upsert: true }
    ).populate("user", "-password");

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      profile: updatedProfile,
      profilePhotoURL: req.file.path,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload profile photo" });
  }
};

module.exports = { uploadProfilePhoto };
