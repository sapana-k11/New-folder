// routes/reviewRoute.js
import express from 'express';
import { addReview, getProductReviews } from '../controller/reviewController.js';
import authMiddleware from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/add',authMiddleware, addReview);
reviewRouter.get('/product/:productId',authMiddleware, getProductReviews);

export default reviewRouter;
