const express = require('express');
const router = express.Router();
const {
  updateUserProfile,
  getUserProfile,
  getAllUsers
} = require('../controllers/profileController');
const { uploadProfilePhoto } = require('../controllers/photoController');
const authenticateUser = require('../middleware/authentication');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const upload = require('../middleware/upload'); 

router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);
router.get('/admin/users', authenticateUser, authorizeAdmin, getAllUsers);
router.post('/upload', authenticateUser, upload.single('image'), uploadProfilePhoto);

module.exports = router;

