const Order = require('../models/Order');

// @desc      Create new order
// @route     POST /api/v1/orders
// @access    Private
exports.addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      restaurant,
      deliveryAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ success: false, error: 'No order items' });
    }

    const order = new Order({
      orderItems,
      user: req.user.id,
      restaurant,
      deliveryAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Get order by ID
// @route     GET /api/v1/orders/:id
// @access    Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('restaurant', 'name address');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Check authorization (only user who created it, the restaurant owner, or admin)
    // For simplicity, we just check user ownership here (expanding to owner tomorrow)
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(401).json({ success: false, error: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Update order to paid
// @route     PUT /api/v1/orders/:id/pay
// @access    Private
exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Get logged in user orders
// @route     GET /api/v1/orders/myorders
// @access    Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('restaurant', 'name image');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Get orders for a restaurant (Owner)
// @route     GET /api/v1/orders/restaurant/:restaurantId
// @access    Private (Owner)
exports.getOrdersForRestaurant = async (req, res, next) => {
  try {
    // In a real app, verify the req.user.id is the owner of req.params.restaurantId
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name email phone')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Update order status
// @route     PUT /api/v1/orders/:id/status
// @access    Private (Owner)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
