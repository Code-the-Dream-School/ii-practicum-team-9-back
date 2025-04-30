const express = require("express");
const router = express.Router();

const {
  addItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
<<<<<<< HEAD
const authenticateUser = require("../middleware/authentication");

router.post("/add-item", authenticateUser, addItem);
=======

router.post("/add-item", addItem);
>>>>>>> f84abf44661db4e462d4b8c87113ef8167186a58
router.get("/explore", getItems);
router.patch("/update-item/:id", updateItem);
router.delete("/delete-item/:id", deleteItem);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> f84abf44661db4e462d4b8c87113ef8167186a58
