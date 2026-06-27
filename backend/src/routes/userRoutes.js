const express = require('express');
const { updateProfile, uploadAvatar } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('image'), uploadAvatar);

module.exports = router;
