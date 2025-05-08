const UserProfile = require("../models/UserProfile");

const authorizeAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userProfile = await UserProfile.findOne({ user: userId });

    if (userProfile.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error("Error authorizing admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = authorizeAdmin;
