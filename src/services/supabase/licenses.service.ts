/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabasePublic } from '@/lib/supabase/public';
import { License } from '@/types';
import { INITIAL_LICENSES_DATA } from '@/services/mock/adminMockStorage';

export async function getLicensesFromSupabase(): Promise<License[]> {
  try {
    const { data, error } = await supabasePublic
      .from('licenses')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_LICENSES_DATA;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      abbreviation: item.abbreviation,
      sortOrder: item.sort_order,
      isActive: item.is_active,
    }));
  } catch (err) {
    console.warn('[getLicensesFromSupabase] Falling back to default licenses:', err);
    return INITIAL_LICENSES_DATA;
  }
}
