const Like = require("../models/Like");
const Item = require("../models/item");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const createResponse = (status, message, data = []) => ({
  status,
  message,
  data,
});

const likeItem = async (req, res) => {
  try {
    const { itemId: id } = req.body;

    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponse("error", "Missing item id"));
    }

    const item = await Item.findOne({ _id: id });
    const user = await User.findOne({ _id: req.user._id });

    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Item not found"));
    }

    const like = await Like.findOne({ user: user._id, item: item._id });

    if (!like) {
      const newLike = await Like.create({ user, item });
      res.status(StatusCodes.OK).json(
        createResponse("success", "Item was liked", {
          like: newLike,
        })
      );
    } else {
      await Like.findOneAndDelete({ _id: like._id });
      res
        .status(StatusCodes.OK)
        .json(createResponse("success", "Item was unliked"));
    }
  } catch (error) {
    console.error("Error liking item:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const getLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findOne({ _id: id });
    const user = await User.findOne({ _id: req.user._id });

    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Item not found"));
    }

    const likeCount = await Like.countDocuments({ item: item._id });
    const likeData = await Like.find({ item: item._id }).populate(
      "user",
      "name"
    );

    if (!likeData) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Item like data not found"));
    } else {
      res.status(StatusCodes.OK).json(
        createResponse("success", "Item like data found", {
          likeCount: likeCount,
          likeData: likeData,
        })
      );
    }
  } catch (error) {
    console.error("Error finding like data:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

module.exports = { likeItem, getLikes };
