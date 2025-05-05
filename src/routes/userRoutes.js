const express = require('express');
const router = express.Router();
const {
  updateUserProfile,
  getUserProfile,
  getAllUsers
} = require('../controllers/profileController');
const authenticateUser = require('../middleware/authentication');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const upload = require('../middleware/upload'); 


router.get('/profile', authenticateUser, (req, res, next) => {
  console.log('Profile route hit');
  next();
}, getUserProfile);
 
router.put('/profile', authenticateUser, updateUserProfile);

router.get('/admin/users', authenticateUser, authorizeAdmin, getAllUsers);

router.post('/upload', authenticateUser, upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path });
});
module.exports = router;

