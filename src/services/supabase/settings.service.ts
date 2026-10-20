import { supabasePublic } from '@/lib/supabase/public';
import { ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { ModalData } from '@/lib/modals/types';
import { StudioWriteups, CareerPrivacyData, PartnerConditionsData } from '@/types';
import { saveSiteSettingAction } from '@/app/actions/admin-mutations';

export async function getSiteSettingFromSupabase<T>(key: string): Promise<T | null> {
  const { data, error } = await supabasePublic
    .from('site_settings')
    .select('content')
    .eq('key', key)
    .single();

  if (error || !data) {
    if (error?.code !== 'PGRST116') {
      console.error(`Error fetching site setting "${key}" from Supabase:`, error);
    }
    return null;
  }

  return data.content as T;
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
  return content;
}
