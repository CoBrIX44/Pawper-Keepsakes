/**
 * Validates if a URL is safe to open or preview.
 * Strictly permits only http: and https: protocols.
 */
export function isSafeUrl(rawUrl: string | undefined | null): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extracts a readable domain from a URL.
 * Falls back to a clean string representation or 'local' if invalid.
 */
export function extractDomain(rawUrl: string | undefined | null): string {
  if (!rawUrl || typeof rawUrl !== 'string') return 'web';
  try {
    const parsed = new URL(rawUrl.trim());
    return parsed.hostname.replace(/^www\./, '') || 'web';
  } catch {
    return 'web';
  }
}

/**
 * Cleans tags: trims, lowercases, removes hash symbols, deduplicates, and limits length.
 */
export function cleanTags(tags: string[] | undefined | null): string[] {
  if (!Array.isArray(tags)) return [];
  const set = new Set<string>();
  for (const raw of tags) {
    if (typeof raw !== 'string') continue;
    const cleaned = raw.trim().replace(/^#+/, '').slice(0, 30);
    if (cleaned.length > 0) {
      set.add(cleaned.toLowerCase());
    }
  }
  return Array.from(set).slice(0, 15);
}

/**
 * Clean and truncate plain text strings to prevent runaway payload sizes.
 */
export function cleanString(val: string | undefined | null, maxLength = 2000): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLength);
}
