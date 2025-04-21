 

const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  location: {
    type: String,
    default: "",
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  interests: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: "",
  },
  userProfilePhotoURL: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("UserProfile", UserProfileSchema);
