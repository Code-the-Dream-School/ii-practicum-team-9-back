const express = require("express");
const router = express.Router();

const {
  addItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const authenticateUser = require("../middleware/authentication");

router.post("/add-item", authenticateUser, addItem);
router.get("/explore", getItems);
router.patch("/update-item/:id", updateItem);
router.delete("/delete-item/:id", deleteItem);

module.exports = router;