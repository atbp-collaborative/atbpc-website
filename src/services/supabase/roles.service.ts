/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabasePublic } from '@/lib/supabase/public';
import { Role, RoleCategory } from '@/types';
import { INITIAL_ROLES_DATA } from '@/lib/dummy-data/roles/roles-data';

// Front-end display labels for departments (with "Logistics" removed from Managers as requested)
export const DEPARTMENT_FRONTEND_LABELS: Record<RoleCategory, string> = {
  designers: 'Designers (Design, Production)',
  managers: 'Managers (Procurement, Administration, Marketing)',
  builders: 'Builders (Construction, Logistics, Supervision)',
};

export const DEPARTMENT_KEYS: RoleCategory[] = ['designers', 'managers', 'builders'];

// In-memory cache for ultra-fast subsequent renders
let cachedRoles: Role[] | null = null;
let inflightRolesPromise: Promise<Role[]> | null = null;

/**
 * Fetches public studio roles from Supabase with instant in-memory caching
 * and safe fallback to default mock data.
 */
export async function getPublicRolesFromSupabase(): Promise<Role[]> {
  if (cachedRoles && cachedRoles.length > 0) {
    return cachedRoles;
  }

  if (inflightRolesPromise) {
    return inflightRolesPromise;
  }

  inflightRolesPromise = (async () => {
    try {
      const { data, error } = await supabasePublic
        .from('roles')
        .select('id, role_code, role_title, category, track_id, role_description, sort_order')
        .eq('role_visibility', 'public')
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        cachedRoles = INITIAL_ROLES_DATA;
        return INITIAL_ROLES_DATA;
      }

      const mapped: Role[] = data.map((r: any) => ({
        id: r.id,
        title: r.role_title,
        code: r.role_code,
        category: r.category as RoleCategory,
        trackId: r.track_id,
        track: r.track_id === 'PROF' ? 'professionals' : 'internship',
        description: r.role_description || '',
        sortOrder: r.sort_order,
      }));

      cachedRoles = mapped;
      return mapped;
    } catch (err) {
      console.warn('[getPublicRolesFromSupabase] Falling back to default roles data:', err);
      cachedRoles = INITIAL_ROLES_DATA;
      return INITIAL_ROLES_DATA;
    } finally {
      inflightRolesPromise = null;
    }
  })();

  return inflightRolesPromise;
}

/**
 * Extracts distinct departments/categories present in Supabase roles,
 * ordered according to standard studio hierarchy.
 */
export function getDepartmentOptionsFromRoles(roles: Role[]) {
  const presentCategories = new Set(roles.map((r) => r.category));
  return DEPARTMENT_KEYS.filter((cat) => presentCategories.has(cat)).map((cat) => ({
    value: cat,
    label: DEPARTMENT_FRONTEND_LABELS[cat] || cat,
  }));
}
