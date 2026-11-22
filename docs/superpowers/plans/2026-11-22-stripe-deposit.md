# Stripe Deposit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A reservation only exists once a 30% card deposit is paid through Stripe (test mode); cancelling ≥ 48 h before check-in refunds that deposit automatically.

**Architecture:** The server computes every amount and creates a PaymentIntent; the app shows Stripe's PaymentSheet, then calls `/reservations/confirm`, which re-reads the PaymentIntent from Stripe and creates the reservation (idempotent on `paymentIntentId`). Pure money/date rules live in `backend/src/utils/deposit.js` (unit-tested with `node:test`); every Stripe call lives in `backend/src/services/payment.service.js`.

**Tech Stack:** Express 5, Prisma 6 (MySQL), `stripe` (Node), Expo SDK 58 + `@stripe/stripe-react-native`, React Query, Maestro.

**Spec:** `docs/superpowers/specs/2026-11-21-stripe-deposit-design.md`

## Global Constraints

- Deposit = **30%** of total, rounded to the cent; `balance = total − deposit`. Stripe receives `Math.round(deposit × 100)` cents, currency `usd`.
- The app never sends an amount: only `destinationId, checkIn, checkOut, guests`.
- Refund iff `checkIn (day at 00:00 UTC) − now ≥ 48 h`; otherwise `non_refundable`. Status becomes `cancelled` either way.
- If the Stripe refund fails, the cancellation fails and nothing changes.
- `POST /reservations` (booking without payment) is removed.
- Keys: `STRIPE_SECRET_KEY` in `backend/.env`, `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `mobile/.env`. Never log or commit them.
- npm only (no bun). Commits without Claude attribution, pushed to `main`.
- UI copy in English (existing app convention). `merchantDisplayName: "GlobeTrek"`, `returnURL: "globetrek://stripe-redirect"` (app scheme is `globetrek`).

## Review Focus

1. **`confirm` called twice / concurrently for one PaymentIntent** → one reservation, both calls return it (unique `paymentIntentId`; on P2002, re-read and return). Test in Task 3.
2. **PaymentIntent of another user, or not `succeeded`** → 403 / 400, no reservation. Test in Task 3.
3. **Cancel exactly at the 48 h boundary** → refunded (≥). Test in Task 1.
4. **Stripe refund throws** → 502, reservation stays `upcoming` with `deposit_paid`. Test in Task 3 (refund an already-refunded intent).
5. **Rounding** (e.g. total 1617 → deposit 485.10, balance 1131.90, 48510 cents; total 0.01 edge not reachable since price ≥ 1) → sums exactly. Test in Task 1.

---

### Task 1: Deposit rules (pure functions)

**Files:**
- Create: `backend/src/utils/deposit.js`
- Test: `backend/test/deposit.test.js`
- Modify: `backend/package.json` (`"test": "node --test test/"`)

**Interfaces:**
- Produces:
  - `DEPOSIT_RATE = 0.3`, `REFUND_WINDOW_MS = 48 * 3600 * 1000`
  - `splitDeposit(total: number) → { deposit: number, balance: number, depositCents: number }`
  - `isRefundable(checkIn: Date, now?: Date) → boolean`

- [ ] **Step 1: Write the failing tests**

```js
const test = require('node:test');
const assert = require('node:assert');
const { splitDeposit, isRefundable } = require('../src/utils/deposit');

test('30% deposit rounded to the cent, sums exactly', () => {
  assert.deepStrictEqual(splitDeposit(1617), { deposit: 485.1, balance: 1131.9, depositCents: 48510 });
  assert.deepStrictEqual(splitDeposit(3500), { deposit: 1050, balance: 2450, depositCents: 105000 });
  const { deposit, balance } = splitDeposit(333.33);
  assert.strictEqual(deposit, 100); // 99.999 → 100.00
  assert.strictEqual(Math.round((deposit + balance) * 100), 33333);
});

test('refundable iff ≥ 48 h before check-in day 00:00 UTC', () => {
  const checkIn = new Date('2026-12-10T00:00:00Z');
  assert.strictEqual(isRefundable(checkIn, new Date('2026-12-08T00:00:00Z')), true);  // exactly 48 h
  assert.strictEqual(isRefundable(checkIn, new Date('2026-12-08T00:00:01Z')), false);
  assert.strictEqual(isRefundable(checkIn, new Date('2026-12-01T12:00:00Z')), true);
});
```

- [ ] **Step 2: Run `cd backend && npm test`** — Expected: FAIL (`Cannot find module '../src/utils/deposit'`).
- [ ] **Step 3: Implement `backend/src/utils/deposit.js`** — round via `Math.round(x * 100) / 100`; balance computed in cents to avoid float drift.
- [ ] **Step 4: Run `npm test`** — Expected: 2 passing.
- [ ] **Step 5: Commit** `feat(api): deposit split and refund window rules`

### Task 2: Schema migration and seed

**Files:**
- Modify: `backend/prisma/schema.prisma` (Reservation + new enum)
- Create: `backend/prisma/migrations/<timestamp>_reservation_deposit/migration.sql`
- Modify: `backend/src/seeds/reservationNotificationSeed.js`

**Interfaces:**
- Produces on `Reservation`: `depositAmount Float`, `balanceDue Float`, `paymentIntentId String? @unique`, `paymentStatus PaymentStatus @default(deposit_paid)`; `enum PaymentStatus { deposit_paid refunded non_refundable }`.

- [ ] **Step 1:** Edit the schema. Generate SQL non-interactively (same method as the sessions migration): `npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --shadow-database-url "$SHADOW_DATABASE_URL" --script > migration.sql`. Since `depositAmount`/`balanceDue` are NOT NULL, append to the SQL: add them with `DEFAULT 0`, then `UPDATE Reservation SET depositAmount = ROUND(price * 0.3, 2), balanceDue = price - ROUND(price * 0.3, 2);`.
- [ ] **Step 2:** `npx prisma migrate deploy && npx prisma generate` — Expected: migration applied.
- [ ] **Step 3:** Seed sets `depositAmount`/`balanceDue` via `splitDeposit(price)` and `paymentStatus: 'deposit_paid'`.
- [ ] **Step 4: Verify** `mysql -e "SELECT bookingRef, price, depositAmount, balanceDue, paymentStatus FROM globetrek.Reservation"` — every row has deposit + balance = price.
- [ ] **Step 5: Commit** `feat(db): deposit and payment fields on reservations`

### Task 3: Payment service and API endpoints

**Files:**
- Create: `backend/src/services/payment.service.js`
- Modify: `backend/src/controllers/reservationController.js`, `backend/src/routes/reservationRoutes.js`
- Modify: `backend/package.json` (`npm install stripe`), `backend/.env.example` (`STRIPE_SECRET_KEY=sk_test_...`)

**Interfaces:**
- Consumes: Task 1 `splitDeposit`, `isRefundable`; Task 2 fields.
- Produces (service):
  - `createDepositIntent({ userId, destinationId, checkIn, checkOut, guests, total }) → { clientSecret, paymentIntentId }` — metadata values as strings; `automatic_payment_methods: { enabled: true }`.
  - `getPaymentIntent(id) → Stripe.PaymentIntent`
  - `refundDeposit(paymentIntentId) → Stripe.Refund`
  - Throws at require time if `STRIPE_SECRET_KEY` is missing.
- Produces (HTTP):
  - `POST /api/reservations/payment-intent` → 200 `{ success, clientSecret, paymentIntentId, total, deposit, balance }`
  - `POST /api/reservations/confirm` `{ paymentIntentId }` → 201 `{ success, reservation }` (200 if it already existed); 400 not succeeded; 403 other user.
  - `PATCH /api/reservations/:id/cancel` → 200 `{ success, reservation, refunded: boolean }`; 502 `{ message: 'Refund failed, your booking was not cancelled' }` on Stripe error.
  - `POST /api/reservations` → removed (404).

- [ ] **Step 1:** Extract the existing body validation of `createReservation` into `parseBooking(body) → { error } | { destination, checkIn, checkOut, guests, nights, total }` and reuse it in `payment-intent`. Delete `createReservation` and its route.
- [ ] **Step 2:** `confirm`: retrieve the intent; `status !== 'succeeded'` → 400; `metadata.userId !== req.user.id` → 403; existing reservation with that `paymentIntentId` → 200; otherwise create (from metadata, recomputing `splitDeposit(Number(metadata.total))`) with `paymentStatus: 'deposit_paid'`; on P2002 for `paymentIntentId`, re-read and return 200. Notifications: `reservation_confirmed` and `payment_successful` (title "Deposit paid", subtitle `Your deposit of ${formatted} for ${destinationName} was received`).
- [ ] **Step 3:** `cancel`: if `paymentIntentId` and `isRefundable(checkIn)` → `refundDeposit` (catch → 502, no DB change) then `paymentStatus: 'refunded'`; with an intent but not refundable → `non_refundable`; seed rows (no intent) → refunded only if refundable, no Stripe call. Cancellation notification `reason`: "Your deposit of $X has been refunded." / "Your deposit of $X is non-refundable (cancelled less than 48 h before arrival)."
- [ ] **Step 4: API checks with curl** (token from `/api/auth/login`; confirm a test intent server-side with `node -e` + `stripe.paymentIntents.confirm(id, { payment_method: 'pm_card_visa', return_url: 'globetrek://x' })`):
  - payment-intent for 3 nights × 1 guest at Paris ($539) → `total 1617, deposit 485.1, balance 1131.9`; Stripe dashboard amount 48510.
  - confirm before paying → 400; confirm after paying → 201; confirm again → 200, same `_id`.
  - confirm with another user's token → 403.
  - cancel (check-in ≥ 2 days out) → `refunded: true`, `paymentStatus: refunded`; cancel a booking whose check-in is tomorrow → `non_refundable`.
  - `POST /api/reservations` → 404.
- [ ] **Step 5: Commit** `feat(api): Stripe deposit payment, confirmation and refunds`

### Task 4: Mobile — pay the deposit when booking

**Files:**
- Modify: `mobile/package.json` (`npx expo install @stripe/stripe-react-native`)
- Modify: `mobile/app/_layout.tsx` (wrap in `StripeProvider` with `publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}`, `urlScheme="globetrek"`)
- Modify: `mobile/services/reservationService.ts`, `mobile/app/book/[id].tsx`
- Modify: `mobile/utils/` — add `depositSplit(total)` mirroring Task 1 for display only

**Interfaces:**
- Consumes: Task 3 HTTP contract.
- Produces:
  - `reservationService.createPaymentIntent(data) → { clientSecret, paymentIntentId, total, deposit, balance }`
  - `reservationService.confirm(paymentIntentId) → { reservation }`
  - `ApiReservation` gains `depositAmount`, `balanceDue`, `paymentStatus: "deposit_paid" | "refunded" | "non_refundable"`; `reservationService.create` removed.

- [ ] **Step 1:** Summary rows: "Total", "Deposit due now (30%)", "Pay at the property (70%)". Button `testID="book-confirm"`: "Pay deposit · $X".
- [ ] **Step 2:** On tap: `createPaymentIntent` → `initPaymentSheet({ merchantDisplayName: "GlobeTrek", paymentIntentClientSecret, returnURL: "globetrek://stripe-redirect" })` → `presentPaymentSheet()`. `error.code === "Canceled"` → stay silently; other error → `Alert.alert("Payment failed", error.message)`; success → `confirm` → invalidate `reservations` + `notifications` → `router.replace` to the detail. Button disabled + spinner while any step runs (prevents double payment).
- [ ] **Step 3: Verify** `npx tsc --noEmit` clean; on the iPhone simulator, book Paris with `4242 4242 4242 4242` (any future date, any CVC) → detail opens; `4000 0000 0000 9995` → "Payment failed", no reservation; swipe the sheet down → no alert.
- [ ] **Step 4: Commit** `feat(mobile): pay a 30% Stripe deposit to book`

### Task 5: Mobile — deposit on the reservation detail and cancellation

**Files:**
- Modify: `mobile/app/reservation-detail.tsx`, `mobile/hooks/queries/useReservationQueries.ts`

**Interfaces:**
- Consumes: Task 4 `ApiReservation` fields; cancel response `refunded`.

- [ ] **Step 1:** Replace the "Service fee $0" row with "Deposit paid" (`depositAmount`) and "Pay at the property" (`balanceDue`); when cancelled, a line "Deposit refunded" or "Deposit non-refundable" per `paymentStatus`.
- [ ] **Step 2:** The cancel dialog message, computed with the same 48 h rule against `checkIn`: "Your deposit of $X will be refunded." or "Your deposit of $X is non-refundable (less than 48 h before arrival)."
- [ ] **Step 3: Verify** on the simulator: cancel the Task 4 booking → dialog says refunded → detail shows "Deposit refunded"; a notification "Reservation cancelled" mentions the refund.
- [ ] **Step 4: Commit** `feat(mobile): show deposit, balance and refund status`

### Task 6: Maestro booking flow

**Files:**
- Modify: `mobile/.maestro/booking.yaml`

- [ ] **Step 1:** After `book-confirm`, wait for the Stripe sheet, tap the card field, `inputText: "4242424242424242"`, expiry `"1234"`, CVC `"123"`, ZIP `"12345"` if shown, tap `'Pay.*'`; then the existing detail/cancel assertions, plus `assertVisible: "Deposit refunded"` after cancelling.
- [ ] **Step 2: Run** `npm run test:e2e` — Expected: 4/4 flows pass.
- [ ] **Step 3: Commit** `test(mobile): booking flow pays the deposit with a Stripe test card`, then push to `main`.
