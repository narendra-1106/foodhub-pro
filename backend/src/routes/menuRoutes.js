const express = require('express');
const {
  getMenus,
  getMenu,
  addMenu,
  updateMenu,
  deleteMenu
} = require('../controllers/menuController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// mergeParams: true allows us to access the restaurantId from the restaurant router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getMenus)
  .post(protect, authorize('owner', 'admin'), addMenu);

router
  .route('/:id')
  .get(getMenu)
  .put(protect, authorize('owner', 'admin'), updateMenu)
  .delete(protect, authorize('owner', 'admin'), deleteMenu);

module.exports = router;
