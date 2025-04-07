const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const MessageSchema = new mongoose.Schema({
  message_from: {
    type: String,
    required: [true, "Please provide a message_from"],
    minlength: 3,
    maxlength: 50,
  },
  message_to: {
    type: String,
    required: [true, "Please provide a message_to"],
    minlength: 3,
  },
  content: {
    type: String,
    required: [true, "Please provide a content"],
    minlength: 3,
    maxlength: 50,
  },  
  
});

module.exports = mongoose.model("Message", MessageSchema);
