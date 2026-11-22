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
  assert.strictEqual(isRefundable(checkIn, new Date('2026-12-08T00:00:00Z')), true); // exactly 48 h
  assert.strictEqual(isRefundable(checkIn, new Date('2026-12-08T00:00:01Z')), false);
  assert.strictEqual(isRefundable(checkIn, new Date('2026-12-01T12:00:00Z')), true);
});
