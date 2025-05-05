const UserProfile = require('../models/UserProfile');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

 
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await UserProfile.findOne({ user: userId }).populate("user", "name email");

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

   
    const cleanProfile = {
      _id: profile._id,
      user: {
        _id: profile.user._id,
        name: profile.user.name,
        email: profile.user.email
      },
      role: profile.role,
      location: profile.location,
      profilePhoto: profile.profilePhoto,
      interests: profile.interests,
      tags: profile.tags,
      bio: profile.bio
    };

    res.status(200).json({ data: cleanProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

 
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const updateFields = {};
    if (req.body.location !== undefined) updateFields.location = req.body.location;
    if (req.body.interests !== undefined) updateFields.interests = req.body.interests;
    if (req.body.tags !== undefined) updateFields.tags = req.body.tags;
    if (req.body.bio !== undefined) updateFields.bio = req.body.bio;
    if (req.body.role !== undefined) updateFields.role = req.body.role;
    if (req.body.profilePhoto !== undefined) updateFields.profilePhoto = req.body.profilePhoto;

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      updateFields,
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
      message: "Profile updated", 
      data: cleanProfile
    });
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
