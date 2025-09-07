//To protect routes
// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if your User model is elsewhere

const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (e.g., "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token's payload (we stored the id)
            // and attach it to the request object
            // Exclude the password when fetching the user
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error('Token verification failed:', error.message);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Not authorized, token failed (invalid)' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Not authorized, token expired' });
            }
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };