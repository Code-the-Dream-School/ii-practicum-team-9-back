const express = require('express');
const Item = require('../models/item');
const router = express.Router();

// POST: Add a new item
router.post('/add-item', async (req, res) => {
  try {
    const { name, title, description, imageUrl } = req.body;

    // Create a new item instance
    const newItem = new Item({
      name,
      title,
      description,
      imageUrl,
    });

    // Save the new item to the database
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

    
    const items = await Item.find(filter).populate('assignedTo', 'name email');
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

module.exports = router;
