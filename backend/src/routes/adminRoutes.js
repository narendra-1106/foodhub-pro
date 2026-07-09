const express = require('express');
const {
  getUsers,
  deleteUser,
  approveRestaurant,
  getSystemStats
} = require('../controllers/adminController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/restaurants/:id/approve').put(approveRestaurant);
router.route('/stats').get(getSystemStats);

module.exports = router;
