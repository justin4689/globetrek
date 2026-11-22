// Every Stripe call lives here, so a future webhook handler can reuse the same functions.
const Stripe = require('stripe');
const { splitDeposit } = require('../utils/deposit');

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing: add your sk_test_ key to backend/.env');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Creates the PaymentIntent for a booking's deposit. The booking itself travels in the metadata:
 * the reservation is only created once the payment has succeeded (see reservationController.confirm).
 */
const createDepositIntent = async ({ userId, destinationId, checkIn, checkOut, guests, total }) => {
  const { depositCents } = splitDeposit(total);
  const intent = await stripe.paymentIntents.create({
    amount: depositCents,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
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

/** Refunds the whole deposit. */
const refundDeposit = (paymentIntentId) => stripe.refunds.create({ payment_intent: paymentIntentId });

module.exports = { createDepositIntent, getPaymentIntent, refundDeposit };
