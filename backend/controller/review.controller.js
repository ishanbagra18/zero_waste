// controller/review.controller.js
import Review from '../models/Review.model.js';
import User from '../models/user.model.js';

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id: reviewedUser } = req.params; // ✅ fix here
    const reviewer = req.user.userId; // from JWT middleware

    if (reviewer === reviewedUser) {
      return res.status(400).json({ message: "You can't review yourself." });
    }

    const review = await Review.create({ reviewer, reviewedUser, rating, comment });

    // Update reviewed user stats
    const allReviews = await Review.find({ reviewedUser });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    const badge =
      avgRating >= 4.5
        ? 'Gold'
        : avgRating >= 3.5
        ? 'Silver'
        : avgRating >= 2.5
        ? 'Bronze'
        : 'No Badge';

    await User.findByIdAndUpdate(reviewedUser, {
      averageRating: avgRating.toFixed(1),
      reviewCount: allReviews.length,
      badge,
    });

    res.status(201).json({ message: 'Review posted successfully', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ reviewedUser: id }).populate('reviewer', 'name');
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
