const mongoose = require("mongoose");

const BarterSchema = new mongoose.Schema(
  {
    initiator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    offeredItem: {
      type: mongoose.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    requestedItem: {
      type: mongoose.Types.ObjectId,
      ref: "Item",
      required: true,
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
