// Every Stripe call lives here, so a future webhook handler can reuse the same functions.
const Stripe = require('stripe');
const { splitDeposit } = require('../utils/deposit');

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing: add your sk_test_ key to backend/.env');
}

// Fail fast on a stuck connection and retry instead of hanging the app for the default 80 s.
// Retries are safe: the SDK sends an idempotency key, so a retried call never charges twice.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { timeout: 20000, maxNetworkRetries: 2 });

/**
 * Creates the PaymentIntent for a booking's deposit. The booking itself travels in the metadata:
 * the reservation is only created once the payment has succeeded (see reservationController.confirm).
 */
const createDepositIntent = async ({ userId, destinationId, checkIn, checkOut, guests, total }) => {
  const { depositCents } = splitDeposit(total);
  const intent = await stripe.paymentIntents.create({
    amount: depositCents,
    currency: 'usd',
    // Methods are managed in the Stripe dashboard; refusing redirects keeps the sheet to cards
    // (and Link) and drops app-switching wallets such as Cash App or Amazon Pay
    automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    description: 'GlobeTrek booking deposit (30%)',
    metadata: {
      userId,
      destinationId,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests: String(guests),
      total: String(total),
    },
  });
  return { clientSecret: intent.client_secret, paymentIntentId: intent.id };
};

const getPaymentIntent = (paymentIntentId) => stripe.paymentIntents.retrieve(paymentIntentId);

/**
 * Refunds the whole deposit. A deposit Stripe already refunded counts as done: an earlier attempt
 * may have gone through even though its response was lost (timeout), and retrying must not fail forever.
 */
const refundDeposit = async (paymentIntentId) => {
  try {
    await stripe.refunds.create({ payment_intent: paymentIntentId });
  } catch (err) {
    if (err.code !== 'charge_already_refunded') throw err;
  }
};

module.exports = { createDepositIntent, getPaymentIntent, refundDeposit };
