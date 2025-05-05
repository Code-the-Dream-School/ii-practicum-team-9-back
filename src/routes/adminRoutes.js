const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const { StatusCodes } = require('http-status-codes');

router.post('/make-admin', async (req, res) => {
  try {
    const userId = req.user._id;
    const userProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { role: 'admin' },
      { new: true }
    );

    if (!userProfile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'User profile not found'
      });
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'User role updated to admin',
      data: userProfile
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router; 