const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { port } = require('./src/config/env');

const authRoutes = require('./src/interfaces/routes/authRoutes');
const productRoutes = require('./src/interfaces/routes/productRoutes');

// Initialize Express App
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Axlero Backend API is running...');
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});