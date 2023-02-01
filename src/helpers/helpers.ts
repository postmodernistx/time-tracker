export interface IFirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

/**
 * Convert Firebase timestamp to JavaScript date.
 * Pass in Firebase timestamp seconds.
 * @param seconds
 */
export function firebaseTimestampToDate(seconds: number): Date {
  return new Date(seconds * 1000);
}

/**
 * Format date as yyyy-mm-dd
 * @param date
 * @param delimiter
 */
export function prettyDate(date: Date, delimiter: string = '-'): string {
  const d = date;

  // @ts-ignore
  return `${d.getFullYear()}${delimiter}${String(d.getMonth() + 1).padStart(2, '0')}${delimiter}${String(
    // @ts-ignore
    d.getDate()
  ).padStart(2, '0')}`;
}
