const express = require("express");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const router = express.Router();

const {
  addItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

router.post("/add-item", addItem);
router.get("/items", getItems);
router.patch("/update-item/:id", updateItem);
router.delete("/delete-item/:id", deleteItem);

module.exports = router;
