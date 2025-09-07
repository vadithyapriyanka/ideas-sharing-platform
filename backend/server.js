 // backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

 

// Import routes
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
// const commentRoutes = require('./routes/commentRoutes');


const app = express();
app.use(cors());
app.use(express.json());


// Basic Route (for testing server is up)
app.get('/', (req, res) => {
    res.send('Backend API is running!');
});

// MOUNT ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
// app.use('/api/comments', commentRoutes);

// Database Connection
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000; // Render (and others) will set process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});