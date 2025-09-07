 // backend/routes/ideaRoutes.js
const express = require('express');
const router = express.Router();
const {
    getIdeas,
    getIdeaById,
    createIdea,
    updateIdea,
    deleteIdea,
    likeIdea,
    addComment
} = require('../controllers/ideaController');
const { protect } = require('../middleware/authMiddleware');

// === Public Routes ===
router.get('/', getIdeas);
router.get('/:id', getIdeaById);

// === Protected Routes (require authentication) ===
router.post('/', protect, createIdea);
router.put('/:id', protect, updateIdea);
router.delete('/:id', protect, deleteIdea);
router.put('/:id/like', protect, likeIdea);
router.post('/:id/comments', protect, addComment);

module.exports = router;