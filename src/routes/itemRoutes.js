import express from 'express';
import Item from '../models/item.js';  
const router = express.Router();

// GET all items
router.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new item
router.post('/items', async (req, res) => {
    const { name, title, description, imageUrl } = req.body;

    const newItem = new Item({
        name,
        title,
        description,
        imageUrl,
    });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;  // <-- Use ES module export
