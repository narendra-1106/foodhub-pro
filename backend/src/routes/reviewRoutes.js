const express = require('express');
const {
  getReviews,
  addReview,
  deleteReview
} = require('../controllers/reviewController');

const { protect } = require('../middlewares/authMiddleware');

// mergeParams: true allows us to access :restaurantId from the parent router
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getReviews)
  .post(protect, addReview);

router.route('/:id')
  .delete(protect, deleteReview);

module.exports = router;
