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
    ).populate("user", "name email");

    const cleanProfile = {
      _id: updatedProfile._id,
      user: {
        _id: updatedProfile.user._id,
        name: updatedProfile.user.name,
        email: updatedProfile.user.email
      },
      role: updatedProfile.role,
      location: updatedProfile.location,
      profilePhoto: updatedProfile.profilePhoto,
      interests: updatedProfile.interests,
      tags: updatedProfile.tags,
      bio: updatedProfile.bio
    };

    res.status(200).json({ 
      message: "Profile photo uploaded successfully",
      data: cleanProfile
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    res.status(500).json({ message: "Error uploading profile photo" });
  }
};

module.exports = { uploadProfilePhoto };
