const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// @desc      Get reviews for a restaurant
// @route     GET /api/v1/restaurants/:restaurantId/reviews
// @access    Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate({
        path: 'user',
        select: 'name'
      });
      
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Add review
// @route     POST /api/v1/restaurants/:restaurantId/reviews
// @access    Private (Customer)
exports.addReview = async (req, res, next) => {
  try {
    req.body.restaurant = req.params.restaurantId;
    req.body.user = req.user.id;

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    // Optional business logic: Check if user has ordered from this restaurant
    // const hasOrdered = await Order.findOne({ user: req.user.id, restaurant: req.params.restaurantId, isPaid: true });
    // if (!hasOrdered) return res.status(403).json({ success: false, error: 'You must order from this restaurant to leave a review' });

    const review = await Review.create(req.body);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this restaurant' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
