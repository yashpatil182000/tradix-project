export const ENTRY_TYPE_LABELS = {
  starting: "Initial Capital",
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  adjustment: "Adjustment",
};

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function toDateTimeLocalValue(date = new Date()) {
  const source = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(source.getTime())) return "";

  const year = source.getFullYear();
  const month = String(source.getMonth() + 1).padStart(2, "0");
  const day = String(source.getDate()).padStart(2, "0");
  const hours = String(source.getHours()).padStart(2, "0");
  const minutes = String(source.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function toUtcIsoFromLocalInput(value) {
  if (!value) return null;

  const text = String(value).trim();
  if (/Z$|[+-]\d{2}:\d{2}$/.test(text)) {
    const absolute = new Date(text);
    return Number.isNaN(absolute.getTime()) ? null : absolute.toISOString();
  }

  const match = text.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/,
  );
  if (!match) {
    const fallback = new Date(text);
    return Number.isNaN(fallback.getTime()) ? null : fallback.toISOString();
  }

  const localDate = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6] || 0),
  );

  return Number.isNaN(localDate.getTime()) ? null : localDate.toISOString();
}
