const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const { prisma } = require('../config/db');

async function seed() {
  await prisma.$connect();
  console.log('✅ Connected to MySQL');

  const user = await prisma.user.findUnique({ where: { email: 'justin@globetrek.com' } });
  if (!user) throw new Error('User not found — run user.seed.js first');

  // Fetch destinations by name
  const byName = {};
  const dests = await prisma.destination.findMany();
  dests.forEach((d) => { byName[d.name] = d; });

  // ─── Favorites ──────────────────────────────────────────────────────────────
  await prisma.favorite.deleteMany({ where: { userId: user.id } });
  const favDests = ['Seychelles', 'Paris', 'Machu Picchu', 'Whitehaven Beach'];
  const favorites = await prisma.favorite.createMany({
    data: favDests.filter((n) => byName[n]).map((n) => ({ userId: user.id, destinationId: byName[n].id })),
  });
  console.log(`✅ ${favorites.count} favorites seeded`);

  // ─── Reservations ───────────────────────────────────────────────────────────
  await prisma.reservation.deleteMany({ where: { userId: user.id } });

  const reservationsData = [
    {
      destinationId: byName['Copacabana']?.id,
      destinationName: 'Copacabana',
      country: 'Brazil',
      checkIn: new Date('2026-06-15'),
      checkOut: new Date('2026-06-22'),
      guests: 2,
      price: 3500, // 250 × 7 nights × 2 guests
      status: 'upcoming',
      bookingRef: 'GTK-20260001',
    },
    {
      destinationId: byName['Seychelles']?.id,
      destinationName: 'Seychelles',
      country: 'Seychelles',
      checkIn: new Date('2026-08-10'),
      checkOut: new Date('2026-08-17'),
      guests: 2,
      price: 10346, // 739 × 7 nights × 2 guests
      status: 'upcoming',
      bookingRef: 'GTK-20260002',
    },
    {
      destinationId: byName['Whitehaven Beach']?.id,
      destinationName: 'Whitehaven Beach',
      country: 'Australia',
      checkIn: new Date('2025-12-20'),
      checkOut: new Date('2025-12-27'),
      guests: 3,
      price: 7350, // 350 × 7 nights × 3 guests
      status: 'completed',
      bookingRef: 'GTK-20250003',
    },
    {
      destinationId: byName['Grace Bay Beach']?.id,
      destinationName: 'Grace Bay Beach',
      country: 'Turks & Caicos',
      checkIn: new Date('2025-10-05'),
      checkOut: new Date('2025-10-12'),
      guests: 2,
      price: 2100, // 150 × 7 nights × 2 guests
      status: 'cancelled',
      bookingRef: 'GTK-20250004',
    },
  ];

  const missing = reservationsData.filter((r) => !r.destinationId).map((r) => r.destinationName);
  if (missing.length) throw new Error(`Destinations not found: ${missing.join(', ')} — run destinationSeed.js first`);

  await prisma.reservation.createMany({
    data: reservationsData.map((r) => ({ ...r, userId: user.id })),
  });
  const reservations = await prisma.reservation.findMany({ where: { userId: user.id }, orderBy: { bookingRef: 'asc' } });
  console.log(`✅ ${reservations.length} reservations seeded:`);
  reservations.forEach((r) => console.log(`   [${r.status}] ${r.destinationName} — ${r.bookingRef}`));

  // ─── Notifications ──────────────────────────────────────────────────────────
  await prisma.notification.deleteMany({ where: { userId: user.id } });

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
      title: 'Payment successful',
      subtitle: 'Your payment of $350 has been completed',
      amount: 350,
      isRead: true,
    },
    {
      type: 'payment_failed',
      title: 'Payment failed',
      subtitle: 'There was an issue with your payment of $430',
      amount: 430,
      reason: 'We were unable to process your payment due to an issue with your credit card.',
      detailReason: 'Please check your card details or update your payment method to complete your reservation. If the problem continues, feel free to contact our support team for assistance.',
      isRead: true,
    },
    {
      type: 'rate_booking',
      title: 'Rate your booking',
      subtitle: 'How was your stay in Grace Bay Beach?',
      destination: 'Grace Bay Beach',
      isRead: true,
    },
  ];

  // Reservation notifications point to the reservation they are about
  const byDestination = Object.fromEntries(reservations.map((r) => [r.destinationName, r.id]));
  const RESERVATION_TYPES = ['reservation_confirmed', 'reservation_cancelled', 'rate_booking'];
  const notifications = await prisma.notification.createMany({
    data: notificationsData.map((n) => ({
      ...n,
      userId: user.id,
      reservationId: RESERVATION_TYPES.includes(n.type) ? byDestination[n.destination] ?? null : null,
    })),
  });
  console.log(`✅ ${notifications.count} notifications seeded`);

  await prisma.$disconnect();
  console.log('✅ Done');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
