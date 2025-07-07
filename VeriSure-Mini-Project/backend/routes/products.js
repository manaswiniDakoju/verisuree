// backend/routes/products.js
const express = require('express');
const router = express.Router();
const blockchainState = require('../store/blockchainState'); // Import our simulated blockchain

// Middleware to set current user context from app.locals
router.use((req, res, next) => {
    // req.app.locals.currentUser is set by the /users/login route
    req.currentUser = req.app.locals.currentUser || { username: 'guest', role: 'customer' }; // Default to guest/customer
    next();
});

// Get all products (simulates querying the blockchain state)
router.get('/', (req, res) => {
    try {
        const products = blockchainState.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a product (simulates addProduct on contract)
router.post('/add', async (req, res) => { // Made async because addProduct now returns a Promise
    const { id, name } = req.body;
    const { username, role } = req.currentUser;

    if (!id || !name) {
        return res.status(400).json({ error: 'Product ID and name are required.' });
    }

    try {
        // Call the simulated contract function, passing current user as msg.sender
        const qrDataUrl = await blockchainState.addProduct(username, id, name);
        res.json({ success: true, message: 'Product added successfully (simulated).', qrDataUrl });
    } catch (error) {
        // Catch the 'require' errors from our simulated contract logic
        res.status(400).json({ error: error.message });
    }
});

// Mark a product as fake (simulates markAsFake on contract)
router.post('/markFake', (req, res) => {
    const { id } = req.body;
    const { username, role } = req.currentUser;

    if (!id) {
        return res.status(400).json({ error: 'Product ID is required.' });
    }

    try {
        // Call the simulated contract function, passing current user as msg.sender
        blockchainState.markAsFake(username, id);
        res.json({ success: true, message: `Product ID ${id} marked as fake (simulated).` });
    } catch (error) {
        // Catch the 'require' errors from our simulated contract logic
        res.status(400).json({ error: error.message });
    }
});

// Check if a product is fake and get product details
router.get('/check/:id', (req, res) => {
    const id = parseInt(req.params.id); // Ensure ID is integer

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid Product ID.' });
    }

    try {
        const product = blockchainState.getProductById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.json({
            id: product.id,
            name: product.name,
            qrHash: product.qrHash,
            isFake: product.isFake,
            message: 'Product authenticity checked (simulated).'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;