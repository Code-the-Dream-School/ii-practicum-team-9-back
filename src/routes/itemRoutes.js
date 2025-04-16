const express = require("express");
const Item = require("../models/Item");
const router = express.Router();

// POST: Add a new item
router.post("/add-item", async (req, res) => {
  try {
    const { name, title, description, imageUrl, createdBy } = req.body;

    // Create a new item instance
    const newItem = new Item({
      name,
      title,
      description,
      imageUrl,
      createdBy,
    });

    // Save the new item to the database
    await newItem.save();

    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Error adding item" });
  }
});

// GET: Fetch all items
router.get("/items", async (req, res) => {
  try {
    // Get all items from the database
    const items = await Item.find();
    res.status(200).json({ message: "All item data reteived", items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
});

router.delete("/delete-item", async (req, res) => {
  try {
    const { itemId: _id } = req.body;

    const item = await Item.findOneAndDelete({ _id });
    res.status(200).json({ message: "Item was deleted", item });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item" });
  }
});

router.patch("/swap-item", async (req, res) => {
  try {
    const {
      body: { itemId: itemId, newOwnerId: userId },
    } = req;

    const itemToSwap = await Item.findByIdAndUpdate(
      { _id: itemId },
      { assignedTo: userId },
      { new: true, runValidators: true }
    );
    itemToSwap.lastSwapDate = Date.now();

    await itemToSwap.save();

    res.status(200).json({ message: "Item was swapped", itemToSwap });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item" });
  }
});

module.exports = router;
