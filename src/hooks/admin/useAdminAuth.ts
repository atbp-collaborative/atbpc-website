/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser, AdminRole } from '@/types';
import { createClient } from '@/lib/supabase/client';
import {
  getAdminSession,
  setAdminSession,
  clearAdminSession,
} from '@/services/mock/adminMockStorage';
import { toast } from 'sonner';

const SIMULATED_ROLE_KEY = 'atbpc_simulated_role_v1';

export function useAdminAuth() {
  const router = useRouter();
  const isGatePassActive = process.env.NEXT_PUBLIC_GATE_PASS === 'true';

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [has2FA, setHas2FA] = useState<boolean>(true);
  const [is2FASetupOpen, setIs2FASetupOpen] = useState(false);
  const [is2FAChallengeOpen, setIs2FAChallengeOpen] = useState(false);
  const [totpFactorId, setTotpFactorId] = useState<string>('');

  // Initialize Auth State
  const loadAuthState = useCallback(async () => {
    setIsLoading(true);

    if (isGatePassActive) {
      // Gate Pass / Dev Bypass Mode
      const baseSession = getAdminSession();
      let activeRole: AdminRole = 'superadmin';

      if (typeof window !== 'undefined') {
        const storedRole = sessionStorage.getItem(SIMULATED_ROLE_KEY) as AdminRole;
        if (storedRole && ['superadmin', 'admin', 'editor'].includes(storedRole)) {
          activeRole = storedRole;
        }
      }

      const activeUser: AdminUser = {
        id: baseSession?.id || 'dev-superadmin-01',
        email: baseSession?.email || 'superadmin@atbpcollaborative.com',
        name:
          activeRole === 'superadmin'
            ? 'Super Admin (Dev)'
            : activeRole === 'admin'
            ? 'Studio Admin (Dev)'
            : 'Project Editor (Dev)',
        role: activeRole,
        avatarUrl: baseSession?.avatarUrl,
        hasPasskey: true,
      };

      setUser(activeUser);
      setHas2FA(true);
      setIsLoading(false);
      return;
    }

    // Live Mode: Supabase Session Check
    try {
      const supabase = createClient();
      const {
        data: { user: authUser },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !authUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Fetch profile from public.admin_users
      const { data: profile, error: profileErr } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileErr || !profile) {
        console.warn('Authenticated in auth.users but no profile in public.admin_users');
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.full_name || 'Admin User',
          role: 'editor', // fallback
        });
      } else {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.full_name || 'Admin User',
          role: profile.role,
          avatarUrl: profile.avatar_url,
          uiPreferences: profile.ui_preferences,
        });
      }

      // Check registered 2FA TOTP factors and assurance level
      try {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const verifiedTotp = factors?.totp?.find((f) => f.status === 'verified');
        const hasVerifiedTotp = Boolean(verifiedTotp);
        setHas2FA(hasVerifiedTotp);

        // Check assurance level: if AAL2 is required but not achieved, user is not fully authenticated
        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aalData && aalData.nextLevel === 'aal2' && aalData.currentLevel !== 'aal2') {
          // Incomplete session: sign out to clean cookie state so user logs in cleanly with email + password
          await supabase.auth.signOut();
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (!verifiedTotp) {
          setIs2FASetupOpen(true);
        }
      } catch {
        // Fallback if 2FA check fails
        setHas2FA(true);
      }
    } catch (err) {
      console.error('[useAdminAuth] Error initializing session:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isGatePassActive]);

  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  // Dev Role Switcher Handler
  const setSimulatedRole = useCallback(
    (role: AdminRole) => {
      if (!isGatePassActive) return;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SIMULATED_ROLE_KEY, role);
      }
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          role,
          name:
            role === 'superadmin'
              ? 'Super Admin (Dev)'
              : role === 'admin'
              ? 'Studio Admin (Dev)'
              : 'Project Editor (Dev)',
        };
      });
      toast.info(`Switched role view to: ${role.toUpperCase()}`);
    },
    [isGatePassActive]
  );

  // Sign In with Credentials (Password)
  const loginWithCredentials = useCallback(
    async (email: string, pass: string): Promise<boolean> => {
      setIsLoading(true);

      if (isGatePassActive) {
        await new Promise((r) => setTimeout(r, 400));
        const mockUser: AdminUser = {
          id: 'dev-usr-01',
          email: email.trim(),
          name: 'Super Admin',
          role: 'superadmin',
        };
        setAdminSession(mockUser);
        setUser(mockUser);
        setIsLoading(false);
        toast.success('Signed in via Gate Pass.');
        router.push('/admin/dashboard');
        return true;
      }

      // Live Supabase Auth
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error || !data.user) {
        toast.error(error?.message || 'Invalid email or password.');
        setIsLoading(false);
        return false;
      }

      // Check if 2FA is enrolled
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const verifiedTotp = factors?.totp?.find((f) => f.status === 'verified');

      if (!verifiedTotp) {
        // First-time 2FA enrollment required
        setIs2FASetupOpen(true);
        setIsLoading(false);
        return true;
      }

      // Check assurance level (AAL2 challenge interception)
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData && aalData.nextLevel === 'aal2' && aalData.currentLevel !== 'aal2') {
        setTotpFactorId(verifiedTotp.id);
        setIs2FAChallengeOpen(true);
        setIsLoading(false);
        return true;
      }

      toast.success('Successfully authenticated.');
      await loadAuthState();
      router.push('/admin/dashboard');
      return true;
    },
    [isGatePassActive, router, loadAuthState]
  );

  // Complete 2FA Challenge Handler
  const complete2FAChallenge = useCallback(async () => {
    setIs2FAChallengeOpen(false);
    setTotpFactorId('');
    toast.success('Successfully authenticated.');
    await loadAuthState();
    router.push('/admin/dashboard');
  }, [loadAuthState, router]);

  // Cancel 2FA Challenge Handler (Signs out of incomplete AAL1 session)
  const cancel2FAChallenge = useCallback(async () => {
    setIs2FAChallengeOpen(false);
    setTotpFactorId('');
    if (!isGatePassActive) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
  }, [isGatePassActive]);

  // Logout
  const logout = useCallback(async () => {
    if (isGatePassActive) {
      clearAdminSession();
      setUser(null);
      toast.info('Signed out of administration console');
      router.push('/admin/login');
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    toast.info('Signed out of administration console');
    router.push('/admin/login');
  }, [isGatePassActive, router]);

  return {
    user,
    isLoading,
    has2FA,
    hasPasskey: has2FA,
    is2FASetupOpen,
    isPasskeySetupOpen: is2FASetupOpen,
    setIs2FASetupOpen,
    setIsPasskeySetupOpen: setIs2FASetupOpen,
    is2FAChallengeOpen,
    setIs2FAChallengeOpen,
    totpFactorId,
    complete2FAChallenge,
    cancel2FAChallenge,
    loginWithCredentials,
    logout,
    setSimulatedRole,
    refreshUser: loadAuthState,
  };
}
