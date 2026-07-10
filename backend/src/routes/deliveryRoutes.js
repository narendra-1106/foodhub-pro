const express = require('express');
const {
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus
} = require('../controllers/deliveryController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Guarding all routes with auth and delivery/admin roles
router.use(protect);
router.use(authorize('delivery', 'admin'));

router.route('/available').get(getAvailableDeliveries);
router.route('/:id/accept').put(acceptDelivery);
router.route('/:id/status').put(updateDeliveryStatus);

module.exports = router;
