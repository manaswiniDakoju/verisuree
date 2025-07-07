// backend/index.js
const express = require('express');
const app = express();
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cors = require('cors'); // Import CORS

const PORT = 5000;

app.use(cors()); // Enable CORS for frontend requests
app.use(express.json());

// Initialize app.locals.currentUser
app.locals.currentUser = null;

// Route handlers
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Basic home route for testing if backend is running
app.get('/', (req, res) => {
    res.send('VeriBlock Backend is running!');
});

app.listen(PORT, () => console.log(`VeriBlock Backend running on http://localhost:${PORT}`));