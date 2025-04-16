// models/Item.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
    lastSwapDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
