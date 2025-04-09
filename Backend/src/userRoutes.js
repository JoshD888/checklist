const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Path to store user data (for simplicity, using a JSON file)
const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users
const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    console.log('users.json file does not exist. Creating a new one...');
    fs.writeFileSync(usersFilePath, JSON.stringify([])); // Create an empty file if it doesn't exist
    return [];
  }
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
};

// Helper function to write users
const writeUsers = (users) => {
  try {
    console.log('Writing users to users.json:', users); // Debugging log
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing to users.json:', error);
  }
};

// Route to register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const users = readUsers();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
});

// Route to log in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  res.status(200).json({ message: 'Login successful' });
});

module.exports = router;