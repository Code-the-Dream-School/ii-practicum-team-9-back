const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  getUserItems,
} = require("../controllers/itemController");
 

router.post('/add-item', upload.single('image'), addItem);
router.get("/explore", getItems);
router.patch("/update-item/:id", updateItem);
router.delete("/delete-item/:id", deleteItem);
router.get('/user/items', getUserItems);
 
 

module.exports = router;