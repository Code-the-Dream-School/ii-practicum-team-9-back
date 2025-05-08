const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  getUserItems,
  getAllItemsAdmin,
} = require("../controllers/itemController");

router.post("/add-item", upload.single("image"), addItem);
router.get("/explore", getItems);
router.patch("/update-item/:id", updateItem);
router.delete("/delete-item/:id", deleteItem);
router.get("/user/items", getUserItems);
router.get("/admin/items", authorizeAdmin, getAllItemsAdmin);

module.exports = router;
