/**
 * Batch dates are stored in Postgres DATE columns, which Prisma returns as
 * UTC midnight. Always read and format them in UTC so a date never shifts by
 * a day in the viewer's or server's time zone.
 */

/** "YYYY-MM-DD" → a UTC-midnight Date for a DATE column. */
export function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

/** DATE column → "YYYY-MM-DD" for <input type="date">. */
export function toDateInput(value: Date | null | undefined) {
  return value ? value.toISOString().slice(0, 10) : '';
}

/** DATE column → "7 Nov 2026". */
export function formatDateOnly(value: Date) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(value);
}

/** Today's date as a UTC-midnight Date, comparable with DATE columns. */
export function todayDateOnly() {
  return parseDateOnly(new Date().toISOString().slice(0, 10));
}
