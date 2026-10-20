/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates URL slug from first and last names following ATBP specifications:
 * - If first name has 1 word: first-last (e.g. "Kim", "Dela Cruz" -> "kim-delacruz")
 * - If first name has 2+ words: first-first-last capped at 2 first names (e.g. "Kim Chi", "Dela Cruz" -> "kim-chi-delacruz")
 * - If last name has multiple tokens (e.g. "Dela Cruz"), they are unified as "delacruz" or hyphenated cleanly.
 * - Reactive and updates immediately as names are entered.
 */
export function generateMemberSlug(firstName: string, lastName: string): string {
  const cleanTokens = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .split(/[\s-]+/)
      .filter(Boolean);

  const firstTokens = cleanTokens(firstName || '');
  const lastTokens = cleanTokens(lastName || '');

  if (firstTokens.length === 0 && lastTokens.length === 0) {
    return '';
  }

  // Capped at up to two first names
  const selectedFirst = firstTokens.slice(0, 2).join('-');
  const selectedLast = lastTokens.join('');

  if (!selectedFirst) return selectedLast;
  if (!selectedLast) return selectedFirst;

  return `${selectedFirst}-${selectedLast}`;
}
