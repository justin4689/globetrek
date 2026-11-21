const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const { prisma } = require('../config/db');
const serialize = require('../utils/serialize');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// ─── GET /users/me ─────────────────────────────────────────────────────────────

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.status(200).json({ success: true, user: serialize(user) });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── PUT /users/profile ────────────────────────────────────────────────────────

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, countryCode, location } = req.body;
    const email = req.body.email !== undefined ? String(req.body.email).trim().toLowerCase() : undefined;

    if (email !== undefined) {
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email' });
      }
      // If email is changing, check it's not already taken
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: req.user.id } },
      });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
    }

    if ((firstName !== undefined && !String(firstName).trim()) || (lastName !== undefined && !String(lastName).trim())) {
      return res.status(400).json({ success: false, message: 'First name and last name cannot be empty' });
    }

    const allowed = {
      firstName: firstName !== undefined ? String(firstName).trim() : undefined,
      lastName: lastName !== undefined ? String(lastName).trim() : undefined,
      email,
      phone,
      countryCode,
      location,
    };
    // Remove undefined keys so we don't accidentally clear fields
    Object.keys(allowed).forEach((k) => allowed[k] === undefined && delete allowed[k]);

    const user = await prisma.user.update({ where: { id: req.user.id }, data: allowed });

    res.status(200).json({ success: true, user: serialize(user) });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }
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

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      omit: { password: false },
    });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(newPassword, 12) },
    });

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
    const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });
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

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: result.secure_url },
    });

    res.status(200).json({ success: true, avatar: user.avatar, user: serialize(user) });
  } catch (error) {
    console.error('uploadAvatar error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile, updatePassword, uploadAvatar };
