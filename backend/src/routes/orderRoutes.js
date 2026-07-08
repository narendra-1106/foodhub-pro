const express = require('express');
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrdersForRestaurant,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/restaurant/:restaurantId').get(protect, authorize('owner', 'admin'), getOrdersForRestaurant);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, authorize('owner', 'admin'), updateOrderStatus);

module.exports = router;
