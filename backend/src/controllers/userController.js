const User = require('../models/User');

// @desc      Update user profile
// @route     PUT /api/v1/users/profile
// @access    Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc      Upload avatar
// @route     POST /api/v1/users/avatar
// @access    Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
