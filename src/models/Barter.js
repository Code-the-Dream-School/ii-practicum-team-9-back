const mongoose = require("mongoose");

const BarterSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
    user2: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
    item1: {
      type: mongoose.Types.ObjectId,
      ref: "Item",
      required: false,
    },
    item2: {
      type: mongoose.Types.ObjectId,
      ref: "Item",
      required: false,
    },
    status: {
      type: String,
      enum: ["offerMade", "offerAccepted", "offerRejected"],
      required: [true, "Please select a status"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Barter", BarterSchema);
