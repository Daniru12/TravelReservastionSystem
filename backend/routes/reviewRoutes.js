import express from 'express';
import {
  addReview,
  getReviewsByPlaceId,
  deleteReview,
  getAllReviews,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/add', addReview);
router.get('/place/:placeId', getReviewsByPlaceId);
router.get('/', getAllReviews); // optional: get all reviews
router.delete('/:id', deleteReview);

export default router;
