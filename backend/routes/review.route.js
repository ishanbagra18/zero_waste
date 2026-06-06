// routes/review.routes.js
import express from 'express';
import { createReview, getUserReviews } from '../controller/review.controller.js';
import { isAuthenticated } from '../middleware/AuthUser.js';

const router = express.Router();

// POST a review to a specific user
// Corrected path from '/review/:id' to '/:id'
router.post('/:id', isAuthenticated, createReview);

// GET reviews for a specific user
// Corrected path from '/review/:id' to '/:id'
router.get('/:id', getUserReviews);

export default router;