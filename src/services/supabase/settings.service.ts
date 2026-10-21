import { supabasePublic } from '@/lib/supabase/public';
import { ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { ModalData } from '@/lib/modals/types';
import { StudioWriteups, CareerPrivacyData, PartnerConditionsData } from '@/types';
import { saveSiteSettingAction } from '@/app/actions/admin-mutations';

// In-memory client cache to make subsequent modal reads instant (0ms)
const clientCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export function invalidateSiteSettingsCache(key?: string) {
  if (key) {
    delete clientCache[key];
  } else {
    for (const k of Object.keys(clientCache)) {
      delete clientCache[k];
    }
  }
}

/**
 * High-performance batch fetch for multiple site settings in a single SQL query.
 * Replaces multiple round trips with a single WHERE key IN (...) query.
 */
export async function getSiteSettingsBatchFromSupabase<T = any>(
  keys: string[]
): Promise<Record<string, T>> {
  if (!keys || keys.length === 0) return {};

  const now = Date.now();
  const missingKeys: string[] = [];
  const results: Record<string, T> = {};

  // Check in-memory cache first if running on client
  if (typeof window !== 'undefined') {
    for (const key of keys) {
      if (clientCache[key] && now - clientCache[key].timestamp < CACHE_TTL_MS) {
        results[key] = clientCache[key].data;
      } else {
        missingKeys.push(key);
      }
    }
    if (missingKeys.length === 0) {
      return results;
    }
  } else {
    missingKeys.push(...keys);
  }

  try {
    const { data, error } = await supabasePublic
      .from('site_settings')
      .select('key, content')
      .in('key', missingKeys);

    if (error) {
      console.error('Error batch fetching site settings from Supabase:', error);
      return results;
    }

    if (data && data.length > 0) {
      for (const row of data) {
        results[row.key] = row.content;
        if (typeof window !== 'undefined') {
          clientCache[row.key] = { data: row.content, timestamp: now };
        }
      }
    }
  } catch (err) {
    console.warn('Failed to query site_settings batch from Supabase:', err);
  }

  return results;
}

export async function getSiteSettingFromSupabase<T>(key: string): Promise<T | null> {
  const batch = await getSiteSettingsBatchFromSupabase<T>([key]);
  return batch[key] || null;
}

export async function getContactInfoFromSupabase(): Promise<ContactInfo | null> {
  return getSiteSettingFromSupabase<ContactInfo>('contact_info');
}

export async function getPrivacyPolicyFromSupabase(): Promise<ModalData | null> {
  return getSiteSettingFromSupabase<ModalData>('privacy_policy');
}

export async function getLegalNoticesFromSupabase(): Promise<ModalData | null> {
  return getSiteSettingFromSupabase<ModalData>('legal_notices');
}

export async function getStudioWriteupsFromSupabase(): Promise<StudioWriteups | null> {
  return getSiteSettingFromSupabase<StudioWriteups>('studio_writeups');
}

export async function getCareerPrivacyFromSupabase(): Promise<CareerPrivacyData | null> {
  return getSiteSettingFromSupabase<CareerPrivacyData>('career_privacy');
}

export async function getPartnerConditionsFromSupabase(): Promise<PartnerConditionsData | null> {
  return getSiteSettingFromSupabase<PartnerConditionsData>('partner_conditions');
}

export async function saveSiteSettingToSupabase<T>(key: string, content: T): Promise<T> {
  const res = await saveSiteSettingAction(key, content);
  if (!res.success) {
    console.error(`Failed to save site setting "${key}" to Supabase:`, res.error);
    throw new Error(res.error || `Failed to save setting ${key}`);
  }
  invalidateSiteSettingsCache(key);
  return content;
}
