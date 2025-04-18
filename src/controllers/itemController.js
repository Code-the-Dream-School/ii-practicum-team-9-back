const Item = require("../models/item");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const createResponse = (status, message, data = []) => ({
  status,
  message,
  data,
});

const addItem = async (req, res) => {
  try {
    const { name, title, description, imageUrl, category, status } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "User not found"));
    }
    if (req.user.role !== "admin" || req.user.userId !== assignedTo) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createResponse("error", "User is not authorized"));
    }

    const newItem = new Item({
      ...req.body,
    });
    newItem.assignedTo = user._id;
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
    // const { search } = req.query;
    // const filter = search
    //   ? {
    //       $or: [
    //         { title: { $regex: search, $options: "i" } },
    //         { name: { $regex: search, $options: "i" } },
    //       ],
    //     }
    //   : {};

    // ONLY RETURN AVAILABLE ITEMS

    const { categoryFilter } = req.body;
    const query = await Item.find({ category: categoryFilter });

    //const items = await Item.find();
    // const items = await Item.find(filter).populate("assignedTo", "name email");
    //res.status(200).json(items);
    res.status(StatusCodes.OK).json(
      createResponse("success", "Items found", {
        items: query,
      })
    );
  } catch (error) {
    console.error("Error fetching items:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, description, imageUrl, category } = req.body;

    const item = await Item.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Item not found"));
    }

    if (
      item.assignedTo.toString() !== req.user.userId ||
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse("error", "User is not authorized to edit this item")
        );
    }

    await item.save();

    res.status(StatusCodes.OK).json(
      createResponse("success", "Item updated successfully", {
        item: item,
      })
    );
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findOneAndDelete({ _id: id });

    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "Item not found"));
    }

    if (
      item.assignedTo.toString() !== req.user.userId ||
      req.user.role !== "admin"
    ) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse("error", "User is not authorized to delete this item")
        );
    }

    res.status(StatusCodes.OK).json(
      createResponse("success", "Item deleted successfully", {
        item: item,
      })
    );
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

module.exports = { addItem, getItems, updateItem, deleteItem };
