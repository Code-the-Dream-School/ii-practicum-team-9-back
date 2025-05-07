 const User = require('../models/User');

const authorizeAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId;  
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();  
  } catch (error) {
    console.error('Error authorizing admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authorizeAdmin;
