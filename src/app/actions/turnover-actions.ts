/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use server';

import { getAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@supabase/supabase-js';

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export interface TurnoverCheckResult {
  isSuperadminExisting: boolean;
  isPendingVerification?: boolean;
  pendingEmail?: string;
  remainingMs?: number;
}

export interface TurnoverActionResult {
  success: boolean;
  message?: string;
  requiresEmailVerification?: boolean;
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Checks whether a verified Superadmin account exists in the database.
 * If an unverified superadmin was created more than 15 minutes ago,
 * it is automatically cleaned up and expired so the owner can redo the turnover ceremony.
 */
export async function checkSuperadminExistsAction(): Promise<TurnoverCheckResult> {
  try {
    const supabase = getAdminClient();

    // 1. Fetch any superadmin records
    const { data: superadmins, error: dbError } = await supabase
      .from('admin_users')
      .select('id, email, created_at')
      .eq('role', 'superadmin');

    if (dbError || !superadmins || superadmins.length === 0) {
      return { isSuperadminExisting: false };
    }

    // 2. Inspect authentication status in auth.users
    for (const admin of superadmins) {
      const { data: authData, error: authError } = await supabase.auth.admin.getUserById(admin.id);

      // If user no longer exists in auth.users, remove orphaned admin record
      if (authError || !authData.user) {
        await supabase.from('admin_users').delete().eq('id', admin.id);
        continue;
      }

      const authUser = authData.user;

      // Confirmed Superadmin -> Permanently deactivate turnover route
      if (authUser.email_confirmed_at) {
        return { isSuperadminExisting: true, isPendingVerification: false };
      }

      // Unconfirmed account: Evaluate 15-minute time limit
      const createdAt = new Date(authUser.created_at).getTime();
      const elapsedMs = Date.now() - createdAt;

      if (elapsedMs < FIFTEEN_MINUTES_MS) {
        // Within the 15-minute verification window
        return {
          isSuperadminExisting: true,
          isPendingVerification: true,
          pendingEmail: authUser.email,
          remainingMs: FIFTEEN_MINUTES_MS - elapsedMs,
        };
      } else {
        // Expired (> 15 minutes without email verification)
        console.warn(`[checkSuperadminExistsAction] Superadmin nomination for ${authUser.email} expired after 15 minutes. Deleting.`);
        await supabase.auth.admin.deleteUser(admin.id);
        await supabase.from('admin_users').delete().eq('id', admin.id);
      }
    }

    return { isSuperadminExisting: false };
  } catch (err: any) {
    console.error('[checkSuperadminExistsAction] Exception:', err);
    return { isSuperadminExisting: false };
  }
}

/**
 * Verifies the master transfer passcode provided by the website owner.
 */
export async function verifyTurnoverCodeAction(providedCode: string): Promise<TurnoverActionResult> {
  try {
    // 1. Guard: Check if a confirmed superadmin already exists
    const status = await checkSuperadminExistsAction();
    if (status.isSuperadminExisting && !status.isPendingVerification) {
      return {
        success: false,
        message: 'The Studio Superadmin handover ceremony has already concluded. This portal is closed.',
      };
    }

    const expectedCode = process.env.ADMIN_TURNOVER_CODE || '12181993';
    if (!providedCode || providedCode.trim() !== expectedCode.trim()) {
      return {
        success: false,
        message: 'Invalid turnover code. Please check your turnover credentials.',
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Server error during code verification.',
    };
  }
}

/**
 * Creates the primary Studio Superadmin account with unconfirmed status.
 * Automatically names the account 'Super Admin'.
 * Dispatches an email verification link with a strict 15-minute confirmation window.
 */
export async function completeTurnoverAction(payload: {
  code: string;
  email: string;
  password: string;
}): Promise<TurnoverActionResult> {
  try {
    const { code, email, password } = payload;

    // 1. Verify code
    const verifyResult = await verifyTurnoverCodeAction(code);
    if (!verifyResult.success) {
      return verifyResult;
    }

    if (!email || !email.includes('@') || !password || password.length < 8) {
      return {
        success: false,
        message: 'Please provide a valid email and a password of at least 8 characters.',
      };
    }

    const adminSupabase = getAdminClient();

    // 2. Clean up any existing unconfirmed user with the same email if present
    const { data: listData } = await adminSupabase.auth.admin.listUsers();
    const existing = listData?.users?.find(
      (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      if (existing.email_confirmed_at) {
        return {
          success: false,
          message: 'An active verified Superadmin already exists with this email address.',
        };
      }
      // If unconfirmed, clean it up so fresh signup succeeds
      await adminSupabase.auth.admin.deleteUser(existing.id);
      await adminSupabase.from('admin_users').delete().eq('id', existing.id);
    }

    // 3. Register user via Public Auth Client to trigger Supabase's verification email dispatch
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
          full_name: 'Super Admin',
          role: 'superadmin',
        },
        emailRedirectTo: `${siteUrl}/api/auth/callback?next=/admin/dashboard`,
      },
    });

    if (authError || !authData.user) {
      console.error('[completeTurnoverAction] Auth signup error:', authError);
      return {
        success: false,
        message: authError?.message || 'Failed to initialize Supabase credentials.',
      };
    }

    const userId = authData.user.id;

    const userPayload: Record<string, any> = {
      id: userId,
      email: email.trim(),
      full_name: 'Super Admin',
      role: 'superadmin',
    };

    // 4. Insert record into public.admin_users (with graceful fallback if ui_preferences is not yet migrated)
    let { error: dbError } = await adminSupabase
      .from('admin_users')
      .upsert(
        {
          ...userPayload,
          ui_preferences: {
            theme: 'dark',
            views: {
              projects: 'grid',
              people: 'list',
              roles: 'roles',
            },
          },
        },
        { onConflict: 'id' }
      );

    if (dbError && dbError.message.includes('ui_preferences')) {
      const fallbackResult = await adminSupabase
        .from('admin_users')
        .upsert(userPayload, { onConflict: 'id' });
      dbError = fallbackResult.error;
    }

    if (dbError) {
      console.error('[completeTurnoverAction] Database profile insertion error:', dbError);
      await adminSupabase.auth.admin.deleteUser(userId);
      return {
        success: false,
        message: 'Database initialization failed: ' + dbError.message,
      };
    }

    return {
      success: true,
      requiresEmailVerification: true,
      user: {
        id: userId,
        email: email.trim(),
      },
    };
  } catch (err: any) {
    console.error('[completeTurnoverAction] Exception:', err);
    return {
      success: false,
      message: err?.message || 'An unexpected error occurred during handover registration.',
    };
  }
}

/**
 * Resends the confirmation email to the nominated Superadmin address.
 */
export async function resendTurnoverVerificationAction(email: string): Promise<TurnoverActionResult> {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Invalid email address provided.' };
    }

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
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to resend confirmation email.' };
  }
}
