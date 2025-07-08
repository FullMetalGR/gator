export function parseRSSDate(dateString: string): Date | null {
  if (!dateString) {
    return null;
  }

  // Try parsing as ISO string first
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  // Try parsing common RSS date formats
  const formats = [
    // RFC 822 format (most common in RSS)
    /^(\w{3}), (\d{1,2}) (\w{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT$/,
    // RFC 822 with timezone
    /^(\w{3}), (\d{1,2}) (\w{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) ([\+\-]\d{4})$/,
    // Alternative format
    /^(\w{3}) (\w{3}) (\d{1,2}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) ([\+\-]\d{4})$/,
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      try {
        return new Date(dateString);
      } catch {
        continue;
      }
    }
  }

  // If all else fails, try the native Date constructor
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch {
    // Ignore parsing errors
  }

  return null;
} 