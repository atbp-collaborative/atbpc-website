/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@supabase/supabase-js';

export interface SuperPanelAccount {
  id: string;
  email: string;
  alias: string;
  role: 'superadmin' | 'admin' | 'editor';
  isEmailConfirmed: boolean;
  createdAt: string;
}

export interface MaintenanceSettings {
  enabled: boolean;
  updatedAt?: string;
}

export interface ContentProtectionSettings {
  enabled: boolean;
  updatedAt?: string;
}

// ==============================================================================
// 1. ADMIN ACCOUNTS (CRUD & VERIFICATION)
// ==============================================================================

/**
 * Fetches all admin, editor, and superadmin accounts with their email verification status.
 */
export async function fetchSuperPanelAccountsAction(): Promise<SuperPanelAccount[]> {
  try {
    const supabase = getAdminClient();

    // 1. Fetch profiles from public.admin_users
    const { data: profiles, error: dbError } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError || !profiles) {
      console.error('[fetchSuperPanelAccountsAction] DB error:', dbError);
      return [];
    }

    // 2. Fetch auth user records to check email_confirmed_at
    const { data: authList, error: authError } = await supabase.auth.admin.listUsers();
    const authMap = new Map<string, { email_confirmed_at: string | null; created_at: string }>();

    if (!authError && authList?.users) {
      for (const u of authList.users) {
        authMap.set(u.id, {
          email_confirmed_at: u.email_confirmed_at || null,
          created_at: u.created_at,
        });
      }
    }

    return profiles.map((p) => {
      const authUser = authMap.get(p.id);
      return {
        id: p.id,
        email: p.email,
        alias: p.full_name || 'Admin User',
        role: (p.role as 'superadmin' | 'admin' | 'editor') || 'editor',
        isEmailConfirmed: Boolean(authUser?.email_confirmed_at),
        createdAt: p.created_at || authUser?.created_at || new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error('[fetchSuperPanelAccountsAction] Exception:', err);
    return [];
  }
}

/**
 * Creates a new team account (Admin or Editor) and triggers email verification.
 */
export async function createSuperPanelAccountAction(payload: {
  alias: string;
  email: string;
  role: 'admin' | 'editor';
  password: string;
}): Promise<{ success: boolean; error?: string; account?: SuperPanelAccount }> {
  try {
    const { alias, email, role, password } = payload;

    if (!alias.trim() || !email.trim() || !password) {
      return { success: false, error: 'All fields are required.' };
    }
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }
    if (!['admin', 'editor'].includes(role)) {
      return { success: false, error: 'Only Admin and Editor roles can be created here.' };
    }

    const adminSupabase = getAdminClient();

    // 1. Check if user already exists in auth.users
    const { data: listData } = await adminSupabase.auth.admin.listUsers();
    const existing = listData?.users?.find(
      (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists.',
      };
    }

    // 2. Register via public client to dispatch Supabase confirmation email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const publicSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: authData, error: authError } = await publicSupabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: alias.trim(),
          role,
        },
        emailRedirectTo: `${siteUrl}/api/auth/callback?next=/admin/dashboard`,
      },
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Failed to initialize Supabase credentials.',
      };
    }

    const userId = authData.user.id;

    // 3. Insert into public.admin_users
    const { error: dbError } = await adminSupabase.from('admin_users').insert({
      id: userId,
      email: email.trim(),
      full_name: alias.trim(),
      role,
      ui_preferences: {
        theme: 'dark',
        views: {
          projects: 'grid',
          people: 'list',
          roles: 'roles',
        },
      },
    });

    if (dbError) {
      console.warn('[createSuperPanelAccountAction] insert error:', dbError);
      // Graceful fallback if ui_preferences is missing
      const fallback = await adminSupabase.from('admin_users').insert({
        id: userId,
        email: email.trim(),
        full_name: alias.trim(),
        role,
      });
      if (fallback.error) {
        await adminSupabase.auth.admin.deleteUser(userId);
        return { success: false, error: fallback.error.message };
      }
    }

    revalidatePath('/admin/super-panel');

    return {
      success: true,
      account: {
        id: userId,
        email: email.trim(),
        alias: alias.trim(),
        role,
        isEmailConfirmed: false,
        createdAt: new Date().toISOString(),
      },
    };
  } catch (err: any) {
    console.error('[createSuperPanelAccountAction] Exception:', err);
    return { success: false, error: err?.message || 'Account creation failed.' };
  }
}

/**
 * Updates an administrative account's alias and administrative tier.
 */
export async function updateSuperPanelAccountAction(payload: {
  id: string;
  alias: string;
  role: 'admin' | 'editor';
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { id, alias, role } = payload;
    if (!id || !alias.trim() || !['admin', 'editor'].includes(role)) {
      return { success: false, error: 'Invalid update payload.' };
    }

    const supabase = getAdminClient();

    // 1. Update public.admin_users
    const { error: dbError } = await supabase
      .from('admin_users')
      .update({
        full_name: alias.trim(),
        role,
      })
      .eq('id', id);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // 2. Update user metadata in auth.users
    await supabase.auth.admin.updateUserById(id, {
      user_metadata: {
        full_name: alias.trim(),
        role,
      },
    });

    revalidatePath('/admin/super-panel');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update account.' };
  }
}

/**
 * Revokes / deletes an administrative account.
 */
export async function deleteSuperPanelAccountAction(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) return { success: false, error: 'User ID is required.' };

    const supabase = getAdminClient();

    // Guard: Prevent deleting a superadmin
    const { data: targetUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', userId)
      .single();

    if (targetUser?.role === 'superadmin') {
      return { success: false, error: 'Superadmin accounts cannot be revoked through this panel.' };
    }

    // 1. Delete from auth.users (cascades)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.warn('[deleteSuperPanelAccountAction] auth delete error:', authError);
    }

    // 2. Delete from public.admin_users
    const { error: dbError } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', userId);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    revalidatePath('/admin/super-panel');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete account.' };
  }
}

/**
 * Resends the email verification invitation to a pending user.
 */
export async function resendAccountVerificationAction(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!email) return { success: false, error: 'Email is required.' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const publicSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { error } = await publicSupabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo: `${siteUrl}/api/auth/callback?next=/admin/dashboard`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to resend confirmation email.' };
  }
}

// ==============================================================================
// 2. MAINTENANCE MODE
// ==============================================================================

/**
 * Retrieves the current maintenance mode state.
 */
export async function getMaintenanceModeAction(): Promise<MaintenanceSettings> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('content, updated_at')
      .eq('key', 'maintenance_mode')
      .single();

    if (error || !data) {
      return { enabled: false };
    }

    const content = data.content as any;
    return {
      enabled: Boolean(content?.enabled),
      updatedAt: data.updated_at || content?.updated_at,
    };
  } catch {
    return { enabled: false };
  }
}

/**
 * Sets maintenance mode state in site_settings and sets cookie for middleware.
 */
export async function setMaintenanceModeAction(
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminClient();
    const now = new Date().toISOString();

    const { error } = await supabase.from('site_settings').upsert({
      key: 'maintenance_mode',
      content: { enabled, updated_at: now },
      updated_at: now,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Set cookie for instant Edge Middleware lookup
    const cookieStore = await cookies();
    cookieStore.set('site_maintenance', enabled ? 'true' : 'false', {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin/super-panel');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update maintenance mode.' };
  }
}

// ==============================================================================
// 3. CONTENT PROTECTION
// ==============================================================================

/**
 * Retrieves the current content protection state.
 */
export async function getContentProtectionAction(): Promise<ContentProtectionSettings> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('content, updated_at')
      .eq('key', 'content_protection')
      .single();

    if (error || !data) {
      return { enabled: false };
    }

    const content = data.content as any;
    return {
      enabled: Boolean(content?.enabled),
      updatedAt: data.updated_at || content?.updated_at,
    };
  } catch {
    return { enabled: false };
  }
}

/**
 * Sets content protection state in site_settings and sets cookie.
 */
export async function setContentProtectionAction(
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminClient();
    const now = new Date().toISOString();

    const { error } = await supabase.from('site_settings').upsert({
      key: 'content_protection',
      content: { enabled, updated_at: now },
      updated_at: now,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Set cookie for instant client/AppShell lookup
    const cookieStore = await cookies();
    cookieStore.set('site_content_protection', enabled ? 'true' : 'false', {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin/super-panel');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update content protection.' };
  }
}


// ==============================================================================
// 4. RBAC PERMISSIONS MATRIX
// ==============================================================================

import {
  type RoleCrudPermission,
  type AdminTypePermissions,
  type RbacMatrixSettings,
  DEFAULT_RBAC_PERMISSIONS,
} from '@/lib/admin/rbac-constants';

export type { RoleCrudPermission, AdminTypePermissions, RbacMatrixSettings };

export async function getRbacPermissionsAction(): Promise<RbacMatrixSettings> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('content, updated_at')
      .eq('key', 'rbac_permissions')
      .single();

    if (error || !data) {
      return DEFAULT_RBAC_PERMISSIONS;
    }

    const content = data.content as any;
    return {
      admin: content?.admin || DEFAULT_RBAC_PERMISSIONS.admin,
      editor: content?.editor || DEFAULT_RBAC_PERMISSIONS.editor,
      updatedAt: data.updated_at || content?.updated_at,
    };
  } catch {
    return DEFAULT_RBAC_PERMISSIONS;
  }
}

export async function setRbacPermissionsAction(
  permissions: RbacMatrixSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminClient();
    const now = new Date().toISOString();

    const { error } = await supabase.from('site_settings').upsert({
      key: 'rbac_permissions',
      content: { ...permissions, updated_at: now },
      updated_at: now,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/super-panel');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update RBAC policies.' };
  }
}

// ==============================================================================
// 5. FOUNDER DESIGNATION
// ==============================================================================

export interface FounderDesignationResult {
  personId: string | null;
  personName?: string;
  license?: string;
  image?: string;
  bio?: string;
  updatedAt?: string;
}

export async function getFounderDesignationAction(): Promise<FounderDesignationResult> {
  try {
    const supabase = getAdminClient();

    // 1. Check site_settings for explicit founder_person_id
    const { data: settingData } = await supabase
      .from('site_settings')
      .select('content, updated_at')
      .eq('key', 'founder_person_id')
      .single();

    let founderId: string | null = (settingData?.content as any)?.personId || null;

    // 2. Query people table
    if (founderId) {
      const { data: person } = await supabase
        .from('people')
        .select('*')
        .eq('id', founderId)
        .single();

      if (person) {
        return {
          personId: person.id,
          personName: person.full_name,
          license: person.prc_license_no || person.license,
          image: person.profile_photo_url || person.image,
          bio: person.short_bio || person.bio,
          updatedAt: settingData?.updated_at,
        };
      }
    }

    // 3. Fallback: Find anyone with Principal Architect in role
    const { data: founderCandidate } = await supabase
      .from('people')
      .select('*')
      .ilike('role', '%Principal Architect%')
      .limit(1)
      .single();

    if (founderCandidate) {
      return {
        personId: founderCandidate.id,
        personName: founderCandidate.full_name,
        license: founderCandidate.prc_license_no || founderCandidate.license,
        image: founderCandidate.profile_photo_url || founderCandidate.image,
        bio: founderCandidate.short_bio || founderCandidate.bio,
      };
    }

    // Default static fallback
    return {
      personId: 'marchie-borja',
      personName: 'Marchie Teodoro Borja',
      license: '0054827',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
      bio: 'Licensed Architect, UAP Makati Chapter Member, and Lecturer.',
    };
  } catch (err) {
    return {
      personId: 'marchie-borja',
      personName: 'Marchie Teodoro Borja',
      license: '0054827',
    };
  }
}

export async function setFounderDesignationAction(
  personId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!personId) return { success: false, error: 'Person ID is required.' };

    const supabase = getAdminClient();
    const now = new Date().toISOString();

    // 1. Save in site_settings
    const { error: settingErr } = await supabase.from('site_settings').upsert({
      key: 'founder_person_id',
      content: { personId, updated_at: now },
      updated_at: now,
    });

    if (settingErr) {
      return { success: false, error: settingErr.message };
    }

    // 2. Update person's role in people table to Principal Architect & Founder
    await supabase
      .from('people')
      .update({
        role: 'Principal Architect & Founder',
        updated_at: now,
      })
      .eq('id', personId);

    revalidatePath('/admin/super-panel');
    revalidatePath('/admin/people');
    revalidatePath('/studio/our-people');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to designate Founder.' };
  }
}

export async function fetchAllPeopleForFounderSelectionAction(): Promise<
  { id: string; name: string; role: string; image?: string }[]
> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('people')
      .select('id, full_name, role, profile_photo_url')
      .order('full_name', { ascending: true });

    if (error || !data || data.length === 0) {
      const { MEMBERS_DATA } = await import('@/lib/dummy-data/works/members');
      return MEMBERS_DATA.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        image: m.image,
      }));
    }

    return data.map((p) => ({
      id: p.id,
      name: p.full_name,
      role: p.role || 'Studio Regular',
      image: p.profile_photo_url,
    }));
  } catch {
    const { MEMBERS_DATA } = await import('@/lib/dummy-data/works/members');
    return MEMBERS_DATA.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      image: m.image,
    }));
  }
}
