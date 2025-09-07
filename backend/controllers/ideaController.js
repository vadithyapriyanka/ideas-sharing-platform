 // backend/controllers/ideaController.js
const Idea = require('../models/Idea');
// console.log('Imported Idea model:', Idea); // Good for debugging
// const User = require('../models/User'); // Not strictly needed here as we use refs

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Public
exports.getIdeas = async (req, res) => {
    try {
        // Fetch ideas, populate user info, and also populate comments with their respective user info
        const ideas = await Idea.find({})
            .populate('user', 'username') // Populate the main post's user
            .populate('comments.user', 'username') // Populate the user for each comment
            .sort({ createdAt: -1 });

        res.json(ideas);
    } catch (error) {
        console.error('Error fetching ideas:', error);
        res.status(500).json({ message: 'Server Error fetching ideas' });
    }
};

// @desc    Get a single idea by ID
// @route   GET /api/ideas/:id
// @access  Public
exports.getIdeaById = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id)
            .populate('user', 'username') // Populate the main post's user
            .populate('comments.user', 'username'); // Populate the user for each comment

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }
        res.json(idea);
    } catch (error) {
        console.error('Error fetching idea by ID:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Idea not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server Error fetching idea' });
    }
};


// @desc    Create a new idea
// @route   POST /api/ideas
// @access  Private (requires login)
exports.createIdea = async (req, res) => {
    // Expect `text` and optional `imageUrl`, `videoUrl` from the request body
    const { text, imageUrl, videoUrl } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Idea text is required' });
    }

    try {
        const newIdea = new Idea({
            text: text,
            imageUrl: imageUrl, // Will be undefined if not provided, which is fine
            videoUrl: videoUrl, // Will be undefined if not provided, which is fine
            user: req.user.id, // req.user is set by authMiddleware
        });

        const createdIdea = await newIdea.save();
        
        // Populate the user field of the newly created idea before sending it back
        const populatedIdea = await Idea.findById(createdIdea._id).populate('user', 'username');

        res.status(201).json(populatedIdea);
    } catch (error) {
        console.error('Error creating idea:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error creating idea' });
    }
};


// @desc    Update an existing idea
// @route   PUT /api/ideas/:id
// @access  Private (only author can update)
exports.updateIdea = async (req, res) => {
    // Only the 'text' field is likely updatable by the user
    const { text } = req.body;

    try {
        let idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Check if the logged-in user is the author of the idea
        if (idea.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this idea' });
        }

        // Update the fields if they were provided
        if (text) idea.text = text;
        // You might decide not to allow media URLs to be updated, or add logic here if you do.

        const updatedIdea = await idea.save();
        await updatedIdea.populate('user', 'username');
        await updatedIdea.populate('comments.user', 'username');


        res.json(updatedIdea);
    } catch (error) {
        console.error('Error updating idea:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error updating idea' });
    }
};

// @desc    Delete an idea
// @route   DELETE /api/ideas/:id
// @access  Private (only author can delete)
exports.deleteIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        if (idea.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this idea' });
        }

        await idea.deleteOne();

        res.json({ message: 'Idea removed successfully' });
    } catch (error) {
        console.error('Error deleting idea:', error);
        res.status(500).json({ message: 'Server Error deleting idea' });
    }
};

// @desc    Like/Unlike an idea
// @route   PUT /api/ideas/:id/like
// @access  Private (requires login)
exports.likeIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Check if the user has already liked the post
        const alreadyLiked = idea.likes.some(likeId => likeId.equals(req.user.id));

        if (alreadyLiked) {
            // Unlike the post
            idea.likes = idea.likes.filter(
                (likeId) => !likeId.equals(req.user.id)
            );
        } else {
            // Like the post
            idea.likes.push(req.user.id);
        }

        await idea.save();
        // Populate user details before sending back
        const populatedIdea = await Idea.findById(idea._id)
                                    .populate('user', 'username')
                                    .populate('comments.user', 'username');

        res.json(populatedIdea);
    } catch (error) {
        console.error('Error liking/unliking idea:', error);
        res.status(500).json({ message: 'Server Error processing like' });
    }
};

// @desc    Add a comment to an idea
// @route   POST /api/ideas/:id/comments
// @access  Private (requires login)
exports.addComment = async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        const newComment = {
            text: text,
            user: req.user.id,
        };

        idea.comments.push(newComment);

        await idea.save();
        
        // Populate everything again before sending back
        const populatedIdea = await Idea.findById(idea._id)
                                    .populate('user', 'username')
                                    .populate('comments.user', 'username');

        res.status(201).json(populatedIdea);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server Error adding comment' });
    }
};