const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

 
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, location, interests, bio, profilePicture } = req.body;

    const updatedData = { name, location, interests, bio };

     
    if (profilePicture) {
      const result = await cloudinary.uploader.upload(profilePicture, {
        folder: 'user_profile_pics',
      });
      updatedData.profilePhoto = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

 
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
};

