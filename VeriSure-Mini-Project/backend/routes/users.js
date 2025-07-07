// backend/routes/users.js
const express = require('express');
const router = express.Router();

// This is a VERY simplified mock login.
// In a real app, this would involve password validation, JWTs, etc.
router.post('/login', (req, res) => {
    const { username, password } = req.body; // Added password, though not checked for demo
    let role = 'customer'; // Default role

    // Simple role assignment for demo purposes:
    // Try these credentials:
    // admin / adminpass -> admin
    // manufacturer / manupass -> manufacturer
    // any_other_username / any_password -> customer
    if (username === 'admin' && password === 'adminpass') {
        role = 'admin';
    } else if (username === 'manufacturer' && password === 'manupass') {
        role = 'manufacturer';
    }

    // Set the current user in app.locals so other routes can access it
    req.app.locals.currentUser = { username, role };

    res.json({
        success: true,
        username,
        role,
        message: `Logged in as ${username} (${role}).`
    });
});

// Logout route to clear current user (important for role switching)
router.post('/logout', (req, res) => {
    req.app.locals.currentUser = null; // Clear the current user
    res.json({ success: true, message: 'Logged out.' });
});

// Get current user info (useful for frontend to know who is logged in)
router.get('/current', (req, res) => {
    if (req.app.locals.currentUser) {
        res.json(req.app.locals.currentUser);
    } else {
        res.status(401).json({ message: 'No user logged in.' });
    }
});

module.exports = router;