const express = require('express');
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantController');

// Include other resource routers
const menuRouter = require('./menuRoutes');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Re-route into other resource routers
router.use('/:restaurantId/menu', menuRouter);

router
  .route('/')
  .get(getRestaurants)
  .post(protect, authorize('owner', 'admin'), createRestaurant);

router
  .route('/:id')
  .get(getRestaurant)
  .put(protect, authorize('owner', 'admin'), updateRestaurant)
  .delete(protect, authorize('owner', 'admin'), deleteRestaurant);

module.exports = router;
