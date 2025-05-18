const Review = require('../models/Review');

// Add a new review
const addReview = async (req, res) => {
  try {
    const { reviewerName, reviewText, rating, placeId } = req.body;

    // Basic validation
    if (!reviewerName || !reviewText || !rating || !placeId) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newReview = new Review({
      reviewerName,
      reviewText,
      rating,
      placeId,
    });

    await newReview.save();

    res.status(201).json({
      message: 'Review added successfully',
      review: newReview,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reviews for a specific place
const getReviewsByPlaceId = async (req, res) => {
  try {
    const { placeId } = req.params;

    const reviews = await Review.find({ placeId }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Optional: Get all reviews (for admin or stats view)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addReview,
  getReviewsByPlaceId,
  deleteReview,
  getAllReviews,
};
