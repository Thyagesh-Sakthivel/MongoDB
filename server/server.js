const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('✅ Server is running with Express!');
});
app.get('/login', (req, res) => {
  res.send('✅ logged in successfully');
});
app.get('/user', (req, res) => {
  res.send('✅ hello from user');
});
app.get('/client', (req, res) => {
  res.send('✅ hi from client'); 
});
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});