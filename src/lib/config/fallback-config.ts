/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Determines whether the application is allowed to fall back to dummy/mock data
 * when Supabase returns empty results or errors.
 *
 * Configured via:
 * NEXT_PUBLIC_ALLOW_DUMMY_FALLBACK="true" | "false"
 *
 * Defaults to `true` if undefined, maintaining backwards compatibility.
 * When set to `false`, empty Supabase tables return empty states ([]) rather than
 * substituting hardcoded dummy records.
 */
export function isDummyFallbackAllowed(): boolean {
  if (process.env.NEXT_PUBLIC_ALLOW_DUMMY_FALLBACK === 'false') {
    return false;
  }
  return true;
}
