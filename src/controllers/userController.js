const User = require('../models/User');

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, location, interests, profilePhoto } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, location, interests, profilePhoto },
      { new: true }
    );

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = { updateProfile };
