// Booking money rules: a 30% deposit is paid in the app, the rest at the property.
// Amounts are dollars with cents; the deposit is refundable until 48 h before check-in.

const DEPOSIT_RATE = 0.3;
const REFUND_WINDOW_MS = 48 * 60 * 60 * 1000;

const toCents = (amount) => Math.round(amount * 100);

/** Splits a total into the deposit (rounded to the cent) and the balance; they always add up to the total. */
const splitDeposit = (total) => {
  const totalCents = toCents(total);
  const depositCents = Math.round(totalCents * DEPOSIT_RATE);
  return {
    deposit: depositCents / 100,
    balance: (totalCents - depositCents) / 100,
    depositCents,
  };
};

/** Check-in dates are stored at 00:00 UTC of the arrival day: refundable while at least 48 h remain. */
const isRefundable = (checkIn, now = new Date()) =>
  new Date(checkIn).getTime() - now.getTime() >= REFUND_WINDOW_MS;

module.exports = { DEPOSIT_RATE, REFUND_WINDOW_MS, splitDeposit, isRefundable };
