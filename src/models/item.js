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
    category: {
      type: String,
      enum: ["item", "service", "lesson"],
      default: "item",
      required: [true, "Please select a category"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    closed: {
      type: Boolean,
      default: false,
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
