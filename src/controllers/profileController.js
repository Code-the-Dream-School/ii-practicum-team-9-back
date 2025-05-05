const UserProfile = require('../models/UserProfile');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

 
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log('Fetching profile for user:', userId);

    const profile = await UserProfile.findOne({ user: userId }).populate("user", "-password");

    if (!profile) {
      const defaultProfile = new UserProfile({
        user: userId,
        profilePhoto: '/default-avatar.png',
        bio: '',
        location: '',
        interests: [],
        tags: []
      });
      await defaultProfile.save();
      return res.status(200).json({ data: defaultProfile });
    }

    res.status(200).json({ data: profile });
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
