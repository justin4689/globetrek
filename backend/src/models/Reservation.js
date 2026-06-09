const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    destinationName: { type: String, required: true },
    country: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    bookingRef: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate bookingRef before saving
reservationSchema.pre('save', async function () {
  if (this.bookingRef) return;
  const year = new Date().getFullYear();
  const count = await mongoose.model('Reservation').countDocuments();
  this.bookingRef = `GTK-${year}${String(count + 1).padStart(4, '0')}`;
});

module.exports = mongoose.model('Reservation', reservationSchema);
