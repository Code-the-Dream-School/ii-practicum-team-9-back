const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    
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
    itemStatus: {
      type: String,
      enum: ["available", "pending", "closed"],
      default: "available",
      required: [true, "Please select a status"],
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", ItemSchema);
