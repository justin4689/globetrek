const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, updatePassword, uploadAvatar } = require('../controllers/userController');

// All user routes require authentication
router.use(protect);

router.get('/me', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.post('/avatar', uploadAvatar);

module.exports = router;
