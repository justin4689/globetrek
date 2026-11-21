const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const serialize = require('../utils/serialize');
const sendEmail = require('../services/email.service');
const { createSession, rotateSession, endSession, endAllSessions } = require('../services/session.service');

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Cryptographically secure 5-digit code (Math.random is predictable)
const generateOtp = () => crypto.randomInt(10000, 100000).toString();

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// Stores a fresh hashed OTP (10 min) on the user and returns the plain code
const issueOtp = async (userId) => {
  const otp = generateOtp();
  await prisma.user.update({
    where: { id: userId },
    data: {
      otp: await bcrypt.hash(otp, 8),
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  return otp;
};

const sendVerificationEmail = async (user, otp) => {
  try {
    await sendEmail(
      user.email,
      'GlobeTrek — Verify your account',
      `Hello ${user.firstName},\n\nYour verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nThe GlobeTrek Team`
    );
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError.message);
  }
};

const sendTokens = async (user, res, statusCode = 200) => {
  // A new session per login: other devices stay signed in
  const { accessToken, refreshToken } = await createSession(user.id);

  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      countryCode: user.countryCode,
      location: user.location,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
    },
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await prisma.user.create({
      data: {
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: normalizedEmail,
        password: await bcrypt.hash(password, 12),
      },
    });

    const otp = await issueOtp(user.id);
    await sendVerificationEmail(user, otp);

    return res.status(201).json({
      success: true,
      message: 'Account created. Please check your email for the verification code.',
      email: user.email,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
      omit: { password: false },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isEmailVerified) {
      const otp = await issueOtp(user.id);
      await sendVerificationEmail(user, otp);

      return res.status(403).json({
        success: false,
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email,
        message: 'Please verify your email first. A new code has been sent to your inbox.',
      });
    }

    await sendTokens(user, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } });
    // Always respond success to avoid email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If this email exists, a reset code has been sent.',
      });
    }

    const otp = await issueOtp(user.id);

    try {
      await sendEmail(
        user.email,
        'GlobeTrek — Password reset code',
        `Hello ${user.firstName},\n\nYour password reset code is: ${otp}\n\nThis code expires in 10 minutes. If you did not request a reset, ignore this email.\n\nThe GlobeTrek Team`
      );
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'If this email exists, a reset code has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
      omit: { otp: false, otpExpiry: false },
    });
    if (!user || !user.otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired code',
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Code has expired. Please request a new one.',
      });
    }

    const isMatch = await bcrypt.compare(String(otp), user.otp);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid code',
      });
    }

    // Mark OTP as used
    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiry: null, isEmailVerified: true },
    });

    // Registration flow: log the user in directly
    if (purpose === 'register') {
      return sendTokens(verifiedUser, res);
    }

    // Password reset flow: return a short-lived reset token
    const resetToken = jwt.sign(
      { id: user.id, purpose: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      message: 'Code verified successfully',
      resetToken,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────

const resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required',
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    if (decoded.purpose !== 'reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid token',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(password, 12) },
    });
    // Whoever had access before the reset is signed out everywhere
    await endAllSessions(user.id);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const rotated = await rotateSession(token);
    if (!rotated) {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }

    res.status(200).json({
      success: true,
      accessToken: rotated.accessToken,
      refreshToken: rotated.refreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

const logout = async (req, res) => {
  try {
    // Only this device is signed out
    await endSession(req.sessionId);

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.status(200).json({ success: true, user: serialize(user) });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  refreshToken,
  logout,
  getMe,
};
