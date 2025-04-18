const Item = require("../models/item");
const User = require("../models/User");
const Barter = require("../models/Barter");
const { StatusCodes } = require("http-status-codes");

const createResponse = (status, message, data = []) => ({
  status,
  message,
  data,
});

const newBarter = async (req, res) => {
  try {
    const { item1, user1, item2, user2 } = req.body;

    // if (req.user.role !== "admin" && req.user.userId !== assignedTo) {
    //   return res
    //     .status(403)
    //     .json({ message: "You can only create items for yourself" });
    // }

    // const user = await User.findById(assignedTo);
    // if (!user) {
    //   return res.status(400).json({ message: "User not found" });
    // }

    const newBarter = new Barter({
      ...req.body,
    });
    newBarter.status = "offerMade";

    await newBarter.save();

    res
      .status(201)
      .json({ message: "Barter has been initiated", barter: newBarter });
  } catch (error) {
    console.error("Error creating barter:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const barterAcceptOrDeny = async (req, res) => {
  try {
    const { item1, user1, item2, user2 } = req.body;

    const item = await Item.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // if (
    //   item.assignedTo.toString() !== req.user.userId &&
    //   req.user.role !== "admin"
    // ) {
    //   return res
    //     .status(403)
    //     .json({ message: "You can only edit your own items" });
    // }

    await item.save();

    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    console.error("Error updating barter:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

module.exports = { newBarter, barterAcceptOrDeny };
