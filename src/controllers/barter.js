const Item = require("../models/item");
const User = require("../models/User");
const Barter = require("../models/Barter");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const createResponse = (status, message, data = []) => ({
  status,
  message,
  data,
});

const newBarter = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { offeredItem, initiator, requestedItem, recipient } = req.body;

    const offeredItemSearch = await Item.findOne({ _id: offeredItem });
    const requestedItemSearch = await Item.findOne({ _id: requestedItem });
    const initiatorSearch = await User.findOne({ _id: initiator });
    const recipientSearch = await User.findOne({ _id: recipient });

    if (!offeredItemSearch || !requestedItemSearch) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Item not found"));
    }

    if (!initiatorSearch || !recipientSearch) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "User not found"));
    }

    if (
      offeredItemSearch.itemStatus !== "available" ||
      requestedItemSearch.itemStatus !== "available"
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponse("error", "Item is no longer available to barter"));
    }

    if (
      (initiatorSearch._id.toString() !== offeredItemSearch.owner.toString() ||
        recipientSearch._id.toString() !==
          requestedItemSearch.owner.toString()) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse("error", "User is not authorized to barter this item")
        );
    }

    if (
      req.user._id.toString() !== initiatorSearch._id.toString() &&
      req.user._id.toString() !== recipientSearch._id.toString() &&
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

    const newBarter = await Barter.create(
      [
        {
          ...req.body,
          status: "offerMade",
        },
      ],
      { session }
    );

    offeredItemSearch.itemStatus = "pending";
    requestedItemSearch.itemStatus = "pending";

    await offeredItemSearch.save({ session });
    await requestedItemSearch.save({ session });

    await session.commitTransaction();

    res.status(StatusCodes.OK).json(
      createResponse("success", "Barter has been initiated", {
        barter: newBarter,
      })
    );
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating barter:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  } finally {
    session.endSession();
  }
};

const barterAcceptOrDeny = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status: statusUpdate } = req.body;

    const barter = await Barter.findOne({ _id: id });

    if (!barter) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Barter not found"));
    }

    if (
      req.user._id.toString() !== barter.initiator.toString() &&
      req.user._id.toString() !== barter.recipient.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse("error", "User is not authorized to edit this barter")
        );
    }

    const updatedBarter = await Barter.findByIdAndUpdate(
      { _id: barter._id },
      { status: statusUpdate },
      { new: true, runValidators: true, session: session }
    );

    const offeredItem = await Item.findOne({ _id: updatedBarter.offeredItem });
    const requestedItem = await Item.findOne({
      _id: updatedBarter.requestedItem,
    });

    if (updatedBarter.status == "offerRejected") {
      offeredItem.itemStatus = "available";
      requestedItem.itemStatus = "available";
      await offeredItem.save({ session });
      await requestedItem.save({ session });
    } else if (updatedBarter.status == "offerAccepted") {
      offeredItem.itemStatus = "closed";
      requestedItem.itemStatus = "closed";
      await offeredItem.save({ session });
      await requestedItem.save({ session });
    }

    await session.commitTransaction();

    res.status(StatusCodes.OK).json(
      createResponse("success", "Barter has been updated successfully", {
        barter: updatedBarter,
      })
    );
  } catch (error) {
    await session.abortTransaction();
    console.error("Error updating barter:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  } finally {
    session.endSession();
  }
};



module.exports = { newBarter, barterAcceptOrDeny };
