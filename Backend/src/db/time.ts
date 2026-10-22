// Lap times are stored as milliseconds. These convert to and from the string formats the API uses.

/**
 * Parses a lap time such as `00:01:23.456` (hours:minutes:seconds.milliseconds) or `01:23.456`
 * into milliseconds. Returns null if the text is not a valid time.
 */
export function parseTime(text: string): number | null {
  const match = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$/.exec(text.trim());
  if (!match) return null;

  const [, hours = '0', minutes, seconds, fraction = '0'] = match;
  if (Number(minutes) > 59 || Number(seconds) > 59) return null;

  const millis = Number(fraction.padEnd(3, '0'));
  return ((Number(hours) * 60 + Number(minutes)) * 60 + Number(seconds)) * 1000 + millis;
}

/** Formats milliseconds as the API's time string, e.g. `1970-01-01T00:01:23.456Z` */
export function millisToTime(millis: number): string {
  return new Date(millis).toISOString();
}
