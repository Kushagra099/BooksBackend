const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://new:new@cluster0.sovjyo2.mongodb.net/test').then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define a schema for the User collection
const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true }
});

// Create a model for the User collection
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to get all users
app.get('/getusers', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a user by ID
app.get('/getuser/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new user
app.post('/newuser', async (req, res) => {
  const { id, email, username } = req.body;
  try {
    const newUser = await User.create({ id, email, username });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to update a user by ID
app.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  try {
    const user = await User.findOneAndUpdate({ id }, { username }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to delete a user by ID
app.delete('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndDelete({ id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get one random user
app.get('/getrandomuser', async (req, res) => {
  try {
    const count = await User.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomUser = await User.findOne().skip(randomIndex);
    res.json(randomUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
