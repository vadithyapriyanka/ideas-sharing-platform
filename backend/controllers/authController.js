 // backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            let message = 'User already exists.';
            if (userExists.email === email) message = 'Email already in use.';
            if (userExists.username === username) message = 'Username already taken.';
            return res.status(400).json({ message });
        }

        // Create new user (password will be hashed by the pre-save hook in User.js)
        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            // Don't send back password, even hashed, in the response for registration
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
                message: 'User registered successfully',
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        // Handle Mongoose validation errors (e.g., email format, required fields)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: 'Please provide email/username and password' });
        }

        // Find user by email or username
        // Explicitly select password because it's set to `select: false` in the schema
        const user = await User.findOne({
            $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }],
        }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
                message: 'Login successful',
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};


// @desc    Get current user profile (Example of a protected route)
// @route   GET /api/auth/me
// @access  Private (requires token)
exports.getMe = async (req, res) => {
    // req.user is set by the authMiddleware
    try {
        // User object (without password) is attached to req.user by authMiddleware
        // We re-fetch to ensure fresh data, though req.user could suffice
        const user = await User.findById(req.user.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);

    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};