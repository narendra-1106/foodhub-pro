const Restaurant = require('../models/Restaurant');

// @desc      Get all restaurants
// @route     GET /api/v1/restaurants
// @access    Public
exports.getRestaurants = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Restaurant.find(JSON.parse(queryStr)).populate('owner', 'name email');

    // Handle Keyword Search (Name, Address, or Cuisines)
    if (req.query.keyword) {
      const regex = new RegExp(req.query.keyword, 'i'); // Case insensitive
      query = query.find({
        $or: [
          { name: regex },
          { address: regex },
          { cuisines: regex }
        ]
      });
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Restaurant.countDocuments(query.getFilter());

    query = query.skip(startIndex).limit(limit);
    const restaurants = await query;

    // Pagination Object
    const pagination = {};
    if (page * limit < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0) pagination.prev = { page: page - 1, limit };

    res.status(200).json({ 
      success: true, 
      count: restaurants.length, 
      pagination,
      data: restaurants 
    });
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
