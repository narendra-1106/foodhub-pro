const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');

// @desc      Get menus
// @route     GET /api/v1/menus
// @route     GET /api/v1/restaurants/:restaurantId/menu
// @access    Public
exports.getMenus = async (req, res, next) => {
  try {
    let query;

    if (req.params.restaurantId) {
      query = Menu.find({ restaurant: req.params.restaurantId });
    } else {
      query = Menu.find().populate({
        path: 'restaurant',
        select: 'name description'
      });
    }

    const menus = await query;

    res.status(200).json({
      success: true,
      count: menus.length,
      data: menus
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Get single menu item
// @route     GET /api/v1/menus/:id
// @access    Public
exports.getMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id).populate({
      path: 'restaurant',
      select: 'name description'
    });

    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Add menu item
// @route     POST /api/v1/restaurants/:restaurantId/menu
// @access    Private (Owner)
exports.addMenu = async (req, res, next) => {
  try {
    req.body.restaurant = req.params.restaurantId;
    req.body.owner = req.user.id;

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to add a menu item to this restaurant' });
    }

    const menu = await Menu.create(req.body);

    res.status(201).json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Update menu item
// @route     PUT /api/v1/menus/:id
// @access    Private (Owner)
exports.updateMenu = async (req, res, next) => {
  try {
    let menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    // Make sure user is menu owner
    if (menu.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this menu item' });
    }

    menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Delete menu item
// @route     DELETE /api/v1/menus/:id
// @access    Private (Owner)
exports.deleteMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    // Make sure user is menu owner
    if (menu.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this menu item' });
    }

    await menu.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
