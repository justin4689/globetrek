const { prisma } = require('../config/db');
const serialize = require('../utils/serialize');
const payments = require('../services/payment.service');
const { splitDeposit, isRefundable } = require('../utils/deposit');

const STATUSES = ['upcoming', 'completed', 'cancelled'];

// A stay is over once its check-out day has passed: flip those "upcoming" reservations to
// "completed". Run before reading so lists and details are always up to date (no cron needed).
const completePastStays = (userId) => {
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return prisma.reservation.updateMany({
    where: { userId, status: 'upcoming', checkOut: { lt: todayUtc } },
    data: { status: 'completed' },
  });
};

// Dates are stored at UTC midnight (date-only bookings): format them in UTC to keep the booked day
const dayLabel = (date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });

// $485.10 / $1,617: cents only when there are some
const usd = (amount) =>
  `$${amount.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 })}`;

// Best-effort: a failed notification must never fail the booking itself.
// `overrides` replaces the default copy of the notification type (title, subtitle, reason).
const notify = (reservation, type, overrides = {}) =>
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
        ...overrides,
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

    await completePastStays(req.user.id);

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
    await completePastStays(req.user.id);

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

// Validates a booking request and prices it. Returns { status, message } on invalid input.
const parseBooking = async ({ destinationId, checkIn, checkOut, guests }) => {
  if (!destinationId || !checkIn || !checkOut || !guests) {
    return { status: 400, message: 'destinationId, checkIn, checkOut and guests are required' };
  }

  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < 1) {
    return { status: 400, message: 'guests must be a positive integer' };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    return { status: 400, message: 'Invalid checkIn or checkOut date' };
  }

  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (checkInDate.getTime() < todayUtc) {
    return { status: 400, message: 'checkIn cannot be in the past' };
  }

  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  if (nights <= 0) {
    return { status: 400, message: 'checkOut must be after checkIn' };
  }

  const destination = await prisma.destination.findUnique({ where: { id: String(destinationId) } });
  if (!destination) {
    return { status: 404, message: 'Destination not found' };
  }

  return {
    booking: {
      destination,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestCount,
      total: destination.price * nights * guestCount,
    },
  };
};

// ─── POST /reservations/payment-intent ─────────────────────────────────────────
// Prices the booking and opens a Stripe payment for its deposit. No reservation is created yet.

const createPaymentIntent = async (req, res) => {
  try {
    const parsed = await parseBooking(req.body);
    if (!parsed.booking) {
      return res.status(parsed.status).json({ success: false, message: parsed.message });
    }
    const { destination, checkIn, checkOut, guests, total } = parsed.booking;

    const { clientSecret, paymentIntentId } = await payments.createDepositIntent({
      userId: req.user.id,
      destinationId: destination.id,
      checkIn,
      checkOut,
      guests,
      total,
    });
    const { deposit, balance } = splitDeposit(total);

    res.status(200).json({ success: true, clientSecret, paymentIntentId, total, deposit, balance });
  } catch (error) {
    console.error('createPaymentIntent error:', error);
    res.status(500).json({ success: false, message: 'Could not start the payment, please try again' });
  }
};

// ─── POST /reservations/confirm ────────────────────────────────────────────────
// Creates the reservation once Stripe says its deposit is paid. Idempotent per PaymentIntent.

const findByPaymentIntent = (paymentIntentId) =>
  prisma.reservation.findUnique({ where: { paymentIntentId }, include: { destination: destinationSummary } });

const confirmReservation = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return res.status(400).json({ success: false, message: 'paymentIntentId is required' });
    }

    let intent;
    try {
      intent = await payments.getPaymentIntent(paymentIntentId);
    } catch (err) {
      if (err.type === 'StripeInvalidRequestError') {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }
      throw err;
    }

    if (intent.metadata.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'This payment belongs to another account' });
    }
    if (intent.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: 'The deposit has not been paid' });
    }

    const existing = await findByPaymentIntent(intent.id);
    if (existing) {
      return res.status(200).json({ success: true, reservation: serialize(existing) });
    }

    const { destinationId, checkIn, checkOut, guests, total } = intent.metadata;
    const destination = await prisma.destination.findUnique({ where: { id: destinationId } });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    const price = Number(total);
    const { deposit, balance } = splitDeposit(price);

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
              checkIn: new Date(checkIn),
              checkOut: new Date(checkOut),
              guests: Number(guests),
              price,
              depositAmount: deposit,
              balanceDue: balance,
              paymentIntentId: intent.id,
              paymentStatus: 'deposit_paid',
              bookingRef: await generateBookingRef(tx),
            },
            include: { destination: destinationSummary },
          })
        );
      } catch (err) {
        if (err.code !== 'P2002') throw err;
        // A concurrent confirm for the same payment won the race: return its reservation
        const raced = await findByPaymentIntent(intent.id);
        if (raced) return res.status(200).json({ success: true, reservation: serialize(raced) });
        if (attempt === 2) throw err; // bookingRef collision three times in a row
      }
    }

    await notify(reservation, 'reservation_confirmed');
    await notify(reservation, 'payment_successful', {
      title: 'Deposit paid',
      subtitle: `Your deposit of ${usd(deposit)} for ${reservation.destinationName} was received`,
      amount: deposit,
      reason: null,
    });

    res.status(201).json({ success: true, reservation: serialize(reservation) });
  } catch (error) {
    console.error('confirmReservation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── PATCH /reservations/:id/cancel ───────────────────────────────────────────
// The deposit is refunded when cancelling at least 48 h before check-in, kept otherwise.

const cancelReservation = async (req, res) => {
  try {
    await completePastStays(req.user.id);

    const reservation = await prisma.reservation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    const refunded = isRefundable(reservation.checkIn);

    // Claim the cancellation atomically so two concurrent requests cannot refund twice
    const claimed = await prisma.reservation.updateMany({
      where: { id: reservation.id, status: 'upcoming' },
      data: { status: 'cancelled', paymentStatus: refunded ? 'refunded' : 'non_refundable' },
    });
    if (claimed.count === 0) {
      return res.status(400).json({ success: false, message: 'Only upcoming reservations can be cancelled' });
    }

    // Demo reservations from the seed have no Stripe payment: nothing to refund there
    if (refunded && reservation.paymentIntentId) {
      try {
        await payments.refundDeposit(reservation.paymentIntentId);
      } catch (err) {
        console.error('refundDeposit error:', err.message);
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: reservation.status, paymentStatus: reservation.paymentStatus },
        });
        return res
          .status(502)
          .json({ success: false, message: 'Refund failed, your booking was not cancelled. Please try again.' });
      }
    }

    const updated = await prisma.reservation.findUnique({ where: { id: reservation.id } });

    await notify(updated, 'reservation_cancelled', {
      reason: refunded
        ? `Your deposit of ${usd(updated.depositAmount)} has been refunded.`
        : `Your deposit of ${usd(updated.depositAmount)} is non-refundable (cancelled less than 48 h before arrival).`,
    });

    res.status(200).json({ success: true, reservation: serialize(updated), refunded });
  } catch (error) {
    console.error('cancelReservation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getReservations, getReservationById, createPaymentIntent, confirmReservation, cancelReservation };
