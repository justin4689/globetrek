const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['reservation_confirmed', 'reservation_cancelled', 'payment_successful', 'payment_failed', 'rate_booking'],
      required: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    destination: { type: String },
    checkIn: { type: String },
    checkOut: { type: String },
    amount: { type: Number },
    reason: { type: String },
    detailReason: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
