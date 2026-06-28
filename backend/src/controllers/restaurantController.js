const Restaurant = require('../models/Restaurant');

// @desc      Get all restaurants
// @route     GET /api/v1/restaurants
// @access    Public
exports.getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ isApproved: true, isActive: true }).populate('owner', 'name email');
    res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Get single restaurant
// @route     GET /api/v1/restaurants/:id
// @access    Public
exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Create new restaurant
// @route     POST /api/v1/restaurants
// @access    Private (Owner)
exports.createRestaurant = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.owner = req.user.id;

    // Check for existing published restaurant if we want to limit 1 per owner (optional)
    const publishedRestaurant = await Restaurant.findOne({ owner: req.user.id });
    if (publishedRestaurant && req.user.role !== 'admin') {
      return res.status(400).json({ success: false, error: 'The user has already published a restaurant' });
    }

    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Update restaurant
// @route     PUT /api/v1/restaurants/:id
// @access    Private (Owner)
exports.updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this restaurant' });
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Delete restaurant
// @route     DELETE /api/v1/restaurants/:id
// @access    Private (Owner)
exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this restaurant' });
    }

    await restaurant.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
