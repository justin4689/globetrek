const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getReservations, getReservationById, createReservation, cancelReservation } = require('../controllers/reservationController');

router.use(protect);

router.get('/', getReservations);
router.get('/:id', getReservationById);
router.post('/', createReservation);
router.patch('/:id/cancel', cancelReservation);

module.exports = router;
