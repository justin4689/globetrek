// Display-only mirror of the API's booking money rules (backend/src/utils/deposit.js).
// The server computes the amounts that are charged and decides on refunds.

export const DEPOSIT_PERCENT = 30;
const REFUND_WINDOW_MS = 48 * 60 * 60 * 1000;

/** 30% deposit rounded to the cent; deposit + balance always equals the total. */
export function splitDeposit(total: number) {
  const totalCents = Math.round(total * 100);
  const depositCents = Math.round((totalCents * DEPOSIT_PERCENT) / 100);
  return { deposit: depositCents / 100, balance: (totalCents - depositCents) / 100 };
}

/** Check-in is stored at 00:00 UTC of the arrival day: refundable while at least 48 h remain. */
export function isRefundable(checkIn: string | Date, now = new Date()) {
  return new Date(checkIn).getTime() - now.getTime() >= REFUND_WINDOW_MS;
}
