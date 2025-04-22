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
      req.user.userId !== initiatorSearch._id.toString() &&
      req.user.userId !== recipientSearch._id.toString() &&
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
    offeredItemSearch.itemStatus = "pending";
    requestedItemSearch.itemStatus = "pending";

    await newBarter.save();
    await offeredItemSearch.save();
    await requestedItemSearch.save();

    res.status(StatusCodes.OK).json(
      createResponse("success", "Barter has been initiated", {
        barter: newBarter,
        items: {
          offeredItem: offeredItemSearch.name,
          requestedItem: requestedItemSearch.name,
        },
        users: {
          initiator: initiatorSearch.name,
          recipient: recipientSearch.name,
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
    const { status: statusUpdate } = req.body;

    const barter = await Barter.findOne({ _id: id });

    if (!barter) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Barter not found"));
    }

    if (
      req.user.userId !== barter.initiator.toString() &&
      req.user.userId !== barter.recipient.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse("error", "User is not authorized to edit this barter")
        );
    }

    barter.status = statusUpdate;
    const offeredItem = await Item.findOne({ _id: barter.offeredItem });
    const requestedItem = await Item.findOne({ _id: barter.requestedItem });

    await barter.save();

    if (barter.status == "offerRejected") {
      offeredItem.itemStatus = "available";
      requestedItem.itemStatus = "available";
      await offeredItem.save();
      await requestedItem.save();
    } else if (barter.status == "offerAccepted") {
      offeredItem.itemStatus = "closed";
      requestedItem.itemStatus = "closed";
      await offeredItem.save();
      await requestedItem.save();
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
