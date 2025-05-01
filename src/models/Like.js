const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Types.ObjectId,
      ref: "Item",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", LikeSchema);
