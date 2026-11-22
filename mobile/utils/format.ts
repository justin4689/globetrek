/** Single price format for the whole app: "$1,250", or "$485.10" when there are cents. */
export function formatPrice(amount: number) {
  const hasCents = !Number.isInteger(Math.round(amount * 100) / 100);
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}
