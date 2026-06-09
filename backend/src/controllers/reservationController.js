const Reservation = require('../models/Reservation');
const Destination = require('../models/Destination');

// ─── GET /reservations ─────────────────────────────────────────────────────────
// Query param: status (upcoming | completed | cancelled)

const getReservations = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const reservations = await Reservation.find(filter)
      .populate('destination', 'name country images')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reservations });
  } catch (error) {
    console.error('getReservations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET /reservations/:id ─────────────────────────────────────────────────────

const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('destination');

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.status(200).json({ success: true, reservation });
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

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ success: false, message: 'checkOut must be after checkIn' });
    }

    const price = destination.price * nights * Number(guests);

    const reservation = await Reservation.create({
      user: req.user.id,
      destination: destinationId,
      destinationName: destination.name,
      country: destination.country,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Number(guests),
      price,
    });

    await reservation.populate('destination', 'name country images');

    res.status(201).json({ success: true, reservation });
  } catch (error) {
    console.error('createReservation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── PATCH /reservations/:id/cancel ───────────────────────────────────────────

const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, user: req.user.id });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Only upcoming reservations can be cancelled' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({ success: true, reservation });
  } catch (error) {
    console.error('cancelReservation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getReservations, getReservationById, createReservation, cancelReservation };
