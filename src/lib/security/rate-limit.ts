/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory token store for sliding rate limit tracking
const ipStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    lastCleanup = now;
    for (const [ip, record] of ipStore.entries()) {
      if (now > record.resetTime) {
        ipStore.delete(ip);
      }
    }
  }
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed within the window (default: 5) */
  maxRequests?: number;
  /** Window duration in milliseconds (default: 15 minutes = 900,000ms) */
  windowMs?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds?: number;
}

/**
 * Checks client IP rate limit against a sliding time window.
 */
export function checkRateLimit(
  request: Request,
  options: RateLimitOptions = {}
): RateLimitResult {
  cleanupExpired();

  const maxRequests = options.maxRequests ?? 5;
  const windowMs = options.windowMs ?? 15 * 60 * 1000; // 15 minutes
  const now = Date.now();

  // Extract client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';

  const record = ipStore.get(ip);

  if (!record || now > record.resetTime) {
    ipStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Standard honeypot field names.
 * Form bots typically populate all detected inputs.
 */
export const HONEYPOT_FIELD_NAME = 'hp_company_website';

/**
 * Validates whether the submission contains honeypot spam.
 * If true, request should be silently dropped or rejected.
 */
export function isHoneypotTriggered(body: Record<string, any>): boolean {
  if (!body || typeof body !== 'object') return false;

  const honeypotKeys = [HONEYPOT_FIELD_NAME, 'honeypot', '_hp', 'website_trap'];
  for (const key of honeypotKeys) {
    const val = body[key];
    if (val !== undefined && val !== null && String(val).trim().length > 0) {
      return true;
    }
  }

  return false;
}
