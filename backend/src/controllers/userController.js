const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

// ─── GET /users/me ─────────────────────────────────────────────────────────────

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── PUT /users/profile ────────────────────────────────────────────────────────

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, countryCode, location } = req.body;

    // If email is changing, check it's not already taken
    if (email) {
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user.id } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
    }

    const allowed = { firstName, lastName, email, phone, countryCode, location };
    // Remove undefined keys so we don't accidentally clear fields
    Object.keys(allowed).forEach((k) => allowed[k] === undefined && delete allowed[k]);

    const user = await User.findByIdAndUpdate(req.user.id, allowed, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── PUT /users/password ───────────────────────────────────────────────────────

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('updatePassword error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── POST /users/avatar ────────────────────────────────────────────────────────

const uploadAvatar = async (req, res) => {
  try {
    const { image } = req.body; // base64 data URI: "data:image/jpeg;base64,..."

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    // Delete old avatar from Cloudinary if it exists
    const currentUser = await User.findById(req.user.id);
    if (currentUser.avatar) {
      // Extract public_id from the URL (last segment without extension)
      const parts = currentUser.avatar.split('/');
      const filename = parts[parts.length - 1];
      const publicId = `globetrek/avatars/${filename.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId).catch(() => {}); // best-effort
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: 'globetrek/avatars',
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true }
    );

    res.status(200).json({ success: true, avatar: user.avatar, user });
  } catch (error) {
    console.error('uploadAvatar error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile, updatePassword, uploadAvatar };
