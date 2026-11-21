/** Single price format for the whole app: "$1,250". */
export function formatPrice(amount: number) {
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}
