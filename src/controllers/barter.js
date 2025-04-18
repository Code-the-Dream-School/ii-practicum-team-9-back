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

    const itemOne = await Item.findOne({ _id: item1 });
    const itemTwo = await Item.findOne({ _id: item2 });
    const userOne = await User.findOne({ _id: user1 });
    const userTwo = await User.findOne({ _id: user2 });

    if (!itemOne || !itemTwo) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Item not found"));
    }

    if (!userOne || !userTwo) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "User not found"));
    }

    if (
      itemOne.available != true ||
      itemTwo.available != true ||
      itemOne.closed != false ||
      itemTwo.closed != false
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponse("error", "Item is no longer available to barter"));
    }

    if (
      (userOne._id.toString() !== itemOne.assignedTo.toString() ||
        userTwo._id.toString() !== itemTwo.assignedTo.toString()) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse("error", "User is not authorized to barter this item")
        );
    }

    if (
      (req.user.userId !== userOne._id.toString() ||
        req.user.userId !== userTwo._id.toString()) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse(
            "error",
            "User is not authorized to initiate this barter"
          )
        );
    }

    const newBarter = new Barter({
      ...req.body,
    });
    newBarter.status = "offerMade";
    itemOne.available = false;
    itemTwo.available = false;

    await newBarter.save();
    await itemOne.save();
    await itemTwo.save();

    res.status(StatusCodes.OK).json(
      createResponse("success", "Barter has been initiated", {
        barter: newBarter,
        items: {
          item1: itemOne.name,
          item2: itemTwo.name,
        },
        users: {
          user1: userOne.name,
          user2: userTwo.name,
        },
      })
    );
  } catch (error) {
    console.error("Error creating barter:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const barterAcceptOrDeny = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const barter = await Barter.findByIdAndUpdate(
      { _id: id },
      { status: status },
      { new: true, runValidators: true }
    );

    if (!barter) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Barter not found"));
    }

    const itemOne = await Item.findOne({ _id: barter.item1 });
    const itemTwo = await Item.findOne({ _id: barter.item2 });

    if (
      (req.user.userId !== barter.user1.toString() ||
        req.user.userId !== barter.user2.toString()) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse("error", "User is not authorized to edit this barter")
        );
    }

    await barter.save();

    if (barter.status == "offerRejected") {
      itemOne.available = true;
      itemTwo.available = true;
      await itemOne.save();
      await itemTwo.save();
    } else if (barter.status == "offerAccepted") {
      itemOne.closed = true;
      itemTwo.closed = true;
      await itemOne.save();
      await itemTwo.save();
    }

    res.status(StatusCodes.OK).json(
      createResponse("success", "Barter has been updated successfully", {
        barter: barter,
      })
    );
  } catch (error) {
    console.error("Error updating barter:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

module.exports = { newBarter, barterAcceptOrDeny };
