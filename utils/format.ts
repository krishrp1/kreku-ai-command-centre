const clockFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export function formatClock(timestamp: number) {
  return clockFormat.format(new Date(timestamp));
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return currencyFormat.format(value);
}
