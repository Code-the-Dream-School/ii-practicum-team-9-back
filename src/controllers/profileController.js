const UserProfile = require('../models/UserProfile');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

 
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await UserProfile.findOne({ user: userId }).populate("user", "-password");

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

 
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      location,
      interests,
      tags,
      bio,
      role,
      userProfilePhotoURL
    } = req.body;

    const updatedFields = {
      location,
      interests,
      tags,
      bio,
      role,
    };

    
    if (userProfilePhotoURL) {
      updatedFields.profilePhoto = userProfilePhotoURL;
    }

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      updatedFields,
      { new: true, upsert: true }
    ).populate("user", "-password");

    res.status(200).json({ message: "Profile updated", profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};
 
const getAllUsers = async (req, res) => {
  try {
    const profiles = await UserProfile.find().populate("user", "-password");
    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
};
