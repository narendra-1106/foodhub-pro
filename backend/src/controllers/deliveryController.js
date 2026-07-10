const Delivery = require('../models/Delivery');
const Order = require('../models/Order');

// @desc      Get all pending deliveries
// @route     GET /api/v1/deliveries/available
// @access    Private (Delivery, Admin)
exports.getAvailableDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find({ status: 'Pending' })
      .populate({
        path: 'order',
        populate: [
          { path: 'restaurant', select: 'name address' },
          { path: 'user', select: 'name phone' }
        ]
      })
      .sort('-createdAt');
      
    res.status(200).json({ success: true, count: deliveries.length, data: deliveries });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Accept a delivery
// @route     PUT /api/v1/deliveries/:id/accept
// @access    Private (Delivery)
exports.acceptDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ success: false, error: 'Delivery not found' });
    }

    if (delivery.status !== 'Pending') {
      return res.status(400).json({ success: false, error: 'Delivery already accepted' });
    }

    delivery.driver = req.user.id;
    delivery.status = 'Accepted';
    await delivery.save();

    res.status(200).json({ success: true, data: delivery });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Update delivery status (Picked Up, Delivered, Location)
// @route     PUT /api/v1/deliveries/:id/status
// @access    Private (Delivery)
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ success: false, error: 'Delivery not found' });
    }

    if (delivery.driver.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this delivery' });
    }

    if (req.body.status) delivery.status = req.body.status;
    if (req.body.lat && req.body.lng) {
      delivery.currentLocation = { lat: req.body.lat, lng: req.body.lng };
    }

    if (req.body.status === 'Picked Up') delivery.pickupTime = Date.now();
    if (req.body.status === 'Delivered') delivery.deliveryTime = Date.now();

    await delivery.save();

    // If delivered, we should also update the parent Order status
    if (req.body.status === 'Delivered') {
      const order = await Order.findById(delivery.order);
      if (order) {
        order.orderStatus = 'Delivered';
        order.deliveredAt = Date.now();
        await order.save();
      }
    }

    res.status(200).json({ success: true, data: delivery });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
