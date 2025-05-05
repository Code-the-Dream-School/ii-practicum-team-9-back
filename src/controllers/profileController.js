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

    // Create a clean response object
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
    console.log('Updating profile for user:', userId);
    console.log('Update data:', req.body);

    const updateFields = {};
    if (req.body.location !== undefined) updateFields.location = req.body.location;
    if (req.body.interests !== undefined) updateFields.interests = req.body.interests;
    if (req.body.tags !== undefined) updateFields.tags = req.body.tags;
    if (req.body.bio !== undefined) updateFields.bio = req.body.bio;
    if (req.body.role !== undefined) updateFields.role = req.body.role;
    if (req.body.profilePhoto !== undefined) updateFields.profilePhoto = req.body.profilePhoto;

    console.log('Fields to update:', updateFields);

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      updateFields,
      { new: true, upsert: true }
    ).populate("user", "-password");

    console.log('Updated profile:', updatedProfile);

    res.status(200).json({ 
      message: "Profile updated", 
      data: updatedProfile
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
