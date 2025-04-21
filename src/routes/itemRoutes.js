const express = require('express');
const Item = require('../models/item');
const User = require('../models/User');
const authenticateUser = require('../middleware/authentication');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const router = express.Router();


router.post('/add-item', authenticateUser, async (req, res) => {
  try {
    const { name, title, description, imageUrl } = req.body;

     
    if (req.user.role !== 'admin' && req.user.userId !== assignedTo) {
      return res.status(403).json({ message: 'You can only create items for yourself' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const newItem = new Item({
      name,
      title,
      description,
      imageUrl,
      user: req.user.userId,
    });

    await newItem.save();

    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Error adding item' });
  }
});


router.get('/items', async (req, res) => {
  try {
    const { search } = req.query;

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const items = await Item.find(filter)
      .populate('user', 'name email location');

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});


router.put('/update-item/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, description, imageUrl } = req.body;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

     
    if (item.assignedTo.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit your own items' });
    }

    item.name = name || item.name;
    item.title = title || item.title;
    item.description = description || item.description;
    item.imageUrl = imageUrl || item.imageUrl;

    await item.save();

    res.status(200).json({ message: 'Item updated successfully', item });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item' });
  }
});

 
router.delete('/delete-item/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

     
    if (item.assignedTo.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own items' });
    }

    await item.remove();

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item' });
  }
});

router.get('/my-items', authenticateUser, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.userId });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ message: 'Error fetching user items' });
  }
});


module.exports = router;
