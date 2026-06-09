const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');
const Favorite = require('../models/Favorite');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const user = await User.findOne({ email: 'justin@globetrek.com' });
  if (!user) throw new Error('User not found — run userSeed.js first');

  // Fetch destinations by name
  const byName = {};
  const dests = await Destination.find({});
  dests.forEach((d) => { byName[d.name] = d; });

  // ─── Favorites ──────────────────────────────────────────────────────────────
  await Favorite.deleteMany({ user: user._id });
  const favDests = ['Seychelles', 'Paris', 'Machu Picchu', 'Whitehaven Beach'];
  const favorites = await Favorite.insertMany(
    favDests.filter((n) => byName[n]).map((n) => ({ user: user._id, destination: byName[n]._id }))
  );
  console.log(`✅ ${favorites.length} favorites seeded`);

  // ─── Reservations ───────────────────────────────────────────────────────────
  await Reservation.deleteMany({ user: user._id });

  const reservationsData = [
    {
      destination: byName['Copacabana']?._id,
      destinationName: 'Copacabana',
      country: 'Brazil',
      checkIn: new Date('2026-06-15'),
      checkOut: new Date('2026-06-22'),
      guests: 2,
      price: 1750,
      status: 'upcoming',
      bookingRef: 'GTK-20260001',
    },
    {
      destination: byName['Seychelles']?._id,
      destinationName: 'Seychelles',
      country: 'Seychelles',
      checkIn: new Date('2026-08-10'),
      checkOut: new Date('2026-08-17'),
      guests: 2,
      price: 5173,
      status: 'upcoming',
      bookingRef: 'GTK-20260002',
    },
    {
      destination: byName['Whitehaven Beach']?._id,
      destinationName: 'Whitehaven Beach',
      country: 'Australia',
      checkIn: new Date('2025-12-20'),
      checkOut: new Date('2025-12-27'),
      guests: 3,
      price: 2450,
      status: 'completed',
      bookingRef: 'GTK-20250003',
    },
    {
      destination: byName['Grace Bay Beach']?._id,
      destinationName: 'Grace Bay Beach',
      country: 'Turks & Caicos',
      checkIn: new Date('2025-10-05'),
      checkOut: new Date('2025-10-12'),
      guests: 2,
      price: 1050,
      status: 'cancelled',
      bookingRef: 'GTK-20250004',
    },
  ];

  const reservations = await Reservation.insertMany(
    reservationsData.map((r) => ({ ...r, user: user._id }))
  );
  console.log(`✅ ${reservations.length} reservations seeded:`);
  reservations.forEach((r) => console.log(`   [${r.status}] ${r.destinationName} — ${r.bookingRef}`));

  // ─── Notifications ──────────────────────────────────────────────────────────
  await Notification.deleteMany({ user: user._id });

  const notificationsData = [
    {
      type: 'reservation_confirmed',
      title: 'Reservation confirmed',
      subtitle: 'Your reservation at Grace Bay Beach is confirmed',
      destination: 'Grace Bay Beach',
      checkIn: 'April 26',
      checkOut: 'April 29',
    },
    {
      type: 'reservation_cancelled',
      title: 'Reservation cancelled',
      subtitle: 'Your reservation at Grace Bay Beach has been cancelled',
      destination: 'Grace Bay Beach',
      checkIn: 'April 26',
      checkOut: 'April 29',
      reason: 'There was an issue with your payment method',
    },
    {
      type: 'reservation_confirmed',
      title: 'Reservation confirmed',
      subtitle: 'Your reservation at Grace Bay Beach is confirmed',
      destination: 'Grace Bay Beach',
      checkIn: 'April 26',
      checkOut: 'April 29',
    },
    {
      type: 'payment_successful',
      title: 'Payment Successful',
      subtitle: 'Your payment of $350 has been completed',
      amount: 350,
      isRead: true,
    },
    {
      type: 'payment_failed',
      title: 'Payment Failed',
      subtitle: 'There was an issue with your payment of $430',
      amount: 430,
      reason: 'We were unable to process your payment due to an issue with your credit card.',
      detailReason: 'Please check your card details or update your payment method to complete your reservation. If the problem continues, feel free to contact our support team for assistance.',
      isRead: true,
    },
    {
      type: 'rate_booking',
      title: 'Rate Your Booking',
      subtitle: 'How was your stay in Grace Bay Beach?',
      destination: 'Grace Bay Beach',
      isRead: true,
    },
  ];

  const notifications = await Notification.insertMany(
    notificationsData.map((n) => ({ ...n, user: user._id }))
  );
  console.log(`✅ ${notifications.length} notifications seeded`);

  await mongoose.disconnect();
  console.log('✅ Done');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
