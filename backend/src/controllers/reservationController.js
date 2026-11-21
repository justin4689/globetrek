const { prisma } = require('../config/db');
const serialize = require('../utils/serialize');

const STATUSES = ['upcoming', 'completed', 'cancelled'];

// Dates are stored at UTC midnight (date-only bookings): format them in UTC to keep the booked day
const dayLabel = (date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });

// Best-effort: a failed notification must never fail the booking itself
const notify = (reservation, type) =>
  prisma.notification
    .create({
      data: {
        userId: reservation.userId,
        reservationId: reservation.id,
        type,
        destination: reservation.destinationName,
        checkIn: dayLabel(reservation.checkIn),
        checkOut: dayLabel(reservation.checkOut),
        ...(type === 'reservation_confirmed'
          ? {
              title: 'Reservation confirmed',
              subtitle: `Your reservation at ${reservation.destinationName} is confirmed`,
            }
          : {
              title: 'Reservation cancelled',
              subtitle: `Your reservation at ${reservation.destinationName} has been cancelled`,
              reason: 'You cancelled this reservation.',
            }),
      },
    })
    .catch((err) => console.error('Notification error:', err.message));
const destinationSummary = { select: { id: true, name: true, country: true, images: true } };

// GTK-<year><4-digit sequence>, unique per year. Retries on the (rare) collision.
const generateBookingRef = async (tx) => {
  const year = new Date().getFullYear();
  const prefix = `GTK-${year}`;
  const last = await tx.reservation.findFirst({
    where: { bookingRef: { startsWith: prefix } },
    orderBy: { bookingRef: 'desc' },
    select: { bookingRef: true },
  });
  const next = last ? parseInt(last.bookingRef.slice(prefix.length), 10) + 1 : 1;
  return `${prefix}${String(next).padStart(4, '0')}`;
};

// ─── GET /reservations ─────────────────────────────────────────────────────────
// Query param: status (upcoming | completed | cancelled)

const getReservations = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };
    if (status) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      where.status = status;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: { destination: destinationSummary },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, reservations: serialize(reservations) });
  } catch (error) {
    console.error('getReservations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET /reservations/:id ─────────────────────────────────────────────────────

const getReservationById = async (req, res) => {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { destination: { include: { reviews: true } } },
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.status(200).json({ success: true, reservation: serialize(reservation) });
  } catch (error) {
    console.error('getReservationById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── POST /reservations ────────────────────────────────────────────────────────

const createReservation = async (req, res) => {
  try {
    const { destinationId, checkIn, checkOut, guests } = req.body;

    if (!destinationId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ success: false, message: 'destinationId, checkIn, checkOut and guests are required' });
    }

    const guestCount = Number(guests);
    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({ success: false, message: 'guests must be a positive integer' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid checkIn or checkOut date' });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
      return res.status(400).json({ success: false, message: 'checkOut must be after checkIn' });
    }

    const destination = await prisma.destination.findUnique({ where: { id: String(destinationId) } });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const price = destination.price * nights * guestCount;

    let reservation;
    for (let attempt = 0; attempt < 3 && !reservation; attempt++) {
      try {
        reservation = await prisma.$transaction(async (tx) =>
          tx.reservation.create({
            data: {
              userId: req.user.id,
              destinationId: destination.id,
              destinationName: destination.name,
              country: destination.country,
              checkIn: checkInDate,
              checkOut: checkOutDate,
              guests: guestCount,
              price,
              bookingRef: await generateBookingRef(tx),
            },
            include: { destination: destinationSummary },
          })
        );
      } catch (err) {
        if (err.code !== 'P2002' || attempt === 2) throw err;
      }
    }

    await notify(reservation, 'reservation_confirmed');

    res.status(201).json({ success: true, reservation: serialize(reservation) });
  } catch (error) {
    console.error('createReservation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── PATCH /reservations/:id/cancel ───────────────────────────────────────────

const cancelReservation = async (req, res) => {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Only upcoming reservations can be cancelled' });
    }

    const updated = await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: 'cancelled' },
    });

    await notify(updated, 'reservation_cancelled');

    res.status(200).json({ success: true, reservation: serialize(updated) });
  } catch (error) {
    console.error('cancelReservation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getReservations, getReservationById, createReservation, cancelReservation };
