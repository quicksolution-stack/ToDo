const express = require('express');
const router = express.Router();
const Todo = require('../models/ToDo');
const auth = require('../middleware/authMiddleware');

// get todos for logged in user (optionally filter by day)
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const query = { user: req.userId };
    if (date) {
      // match todos for a particular day (date string YYYY-MM-DD)
      const start = new Date(date);
      start.setHours(0,0,0,0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }
    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// create todo
router.post('/', auth, async (req, res) => {
  try {
    const { text, date } = req.body;
    if (!text) return res.status(400).json({ message: 'Text required' });
    const todo = new Todo({ user: req.userId, text, date: date ? new Date(date) : undefined });
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// update (toggle completed or update text)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, user: req.userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    const updates = {};
    if (typeof req.body.completed !== 'undefined') updates.completed = req.body.completed;
    if (typeof req.body.text !== 'undefined') updates.text = req.body.text;

    Object.assign(todo, updates);
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
