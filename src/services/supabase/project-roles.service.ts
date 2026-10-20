/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabasePublic } from '@/lib/supabase/public';
import { ProjectRole } from '@/types';
import { INITIAL_PROJECT_ROLES_DATA } from '@/services/mock/adminMockStorage';

export async function getProjectRolesFromSupabase(includeInactive = false): Promise<ProjectRole[]> {
  try {
    let query = supabasePublic
      .from('project_roles')
      .select('*')
      .order('name', { ascending: true });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return INITIAL_PROJECT_ROLES_DATA;
    }

    return data.map((item: any) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      description: item.description,
      isActive: item.is_active,
    }));
  } catch (err) {
    console.warn('[getProjectRolesFromSupabase] Falling back to default project roles:', err);
    return INITIAL_PROJECT_ROLES_DATA;
  }
}
