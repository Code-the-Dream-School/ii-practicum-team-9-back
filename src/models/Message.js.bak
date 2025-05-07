const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const MessageSchema = new mongoose.Schema({
  message_from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500,
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model("Message", MessageSchema);
