const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getReservations,
  getReservationById,
  createPaymentIntent,
  confirmReservation,
  cancelReservation,
} = require('../controllers/reservationController');

router.use(protect);

router.get('/', getReservations);
// A reservation is only created by /confirm, once its 30% deposit is paid
router.post('/payment-intent', createPaymentIntent);
router.post('/confirm', confirmReservation);
router.get('/:id', getReservationById);
router.patch('/:id/cancel', cancelReservation);

module.exports = router;
