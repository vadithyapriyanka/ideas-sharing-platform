 // backend/models/Idea.js (Updated)
const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    
    text: {
        type: String,
        required: [true, 'Please add some text for your idea'],
    },
    imageUrl: { // URL of the uploaded image from Cloudinary
        type: String,
    },
    videoUrl: { // URL of the uploaded video from Cloudinary
        type: String,
    },
    likes: { // Array of user IDs who liked it
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
    comments: [ // We can embed simple comments directly
        {
            user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true }); // Using timestamps adds `createdAt` and `updatedAt` automatically

module.exports = mongoose.model('Idea', IdeaSchema);