const Item = require("../models/item");
const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const { StatusCodes } = require("http-status-codes");

const createResponse = (status, message, data = []) => ({
  status,
  message,
  data,
});

const addItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", message: "Image file is required" });
    }

    const imageUrl = req.file.path;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "User not found"));
    }

    const userProfile = await UserProfile.findOne({ user: user._id });
    if (!userProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "User profile not found"));
    }

    const newItem = new Item({
      title,
      description,
      imageUrl,
      category,
      owner: user._id,
      userName: userProfile.name || user.name,
      userPhoto: userProfile.profilePhoto || "",
    });

    await newItem.save();

    res.status(StatusCodes.CREATED).json(
      createResponse("success", "Item was created", {
        item: newItem,
      })
    );
  } catch (error) {
    console.error("Error adding item:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const getItems = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const items = await Item.find(filter).populate("owner", "name email");

    res.status(StatusCodes.OK).json(
      createResponse("success", "Items found", {
        items: items,
      })
    );
  } catch (error) {
    console.error("Error fetching items:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const getUserItems = async (req, res) => {
  try {
    const userId = req.user._id;

    const items = await Item.find({ owner: userId }).populate(
      "owner",
      "name email"
    );

    res.status(StatusCodes.OK).json(
      createResponse("success", "User's items found", {
        items: items,
      })
    );
  } catch (error) {
    console.error("Error fetching user's items:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const getAllItemsAdmin = async (req, res) => {
  try {
    const items = await Item.find().populate("owner", "name email");

    res.status(StatusCodes.OK).json(
      createResponse("success", "Items found for admin", {
        items: items,
      })
    );
  } catch (error) {
    console.error("Error fetching items for admin:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, description, imageUrl, category } = req.body;

    const item = await Item.findOne({ _id: id });
    const userProfile = await UserProfile.findOne({ user: req.user._id });

    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Item not found"));
    }

    if (
      item.owner.toString() !== req.user._id.toString() &&
      userProfile.role !== "admin"
    ) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse("error", "User is not authorized to edit this item")
        );
    }

    const updatedItem = await Item.findByIdAndUpdate(
      { _id: item._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json(
      createResponse("success", "Item updated successfully", {
        item: updatedItem,
      })
    );
  } catch (error) {
    console.error("Error updating item:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findOne({ _id: id });
    const userProfile = await UserProfile.findOne({ user: req.user._id });

    if (!item) {
      console.error(`Item with ID ${id} not found`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Item not found"));
    }

    if (
      item.owner.toString() !== req.user._id.toString() &&
      userProfile.role !== "admin"
    ) {
      console.error(
        `User ${req.user.userId} is not authorized to delete this item`
      ); // Log unauthorized deletion attempt
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse("error", "User is not authorized to delete this item")
        );
    }

    await Item.deleteOne({ _id: item._id });

    res.status(StatusCodes.OK).json(
      createResponse("success", "Item deleted successfully", {
        item: item,
      })
    );
  } catch (error) {
    console.error("Error in deleteItem function:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

module.exports = {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  getUserItems,
  getAllItemsAdmin,
};
