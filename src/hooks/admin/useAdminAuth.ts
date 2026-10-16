/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from '@/types';
import {
  getAdminSession,
  setAdminSession,
  clearAdminSession,
} from '@/services/mock/adminMockStorage';
import { toast } from 'sonner';

export function useAdminAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getAdminSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const loginWithCredentials = useCallback(
    async (email: string, pass: string): Promise<boolean> => {
      setIsLoading(true);
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 600));

      if (!email || !pass) {
        toast.error('Please enter both email and password');
        setIsLoading(false);
        return false;
      }

      const mockUser: AdminUser = {
        id: 'admin-usr-' + Date.now(),
        email: email.trim(),
        name: email.split('@')[0] || 'Studio Admin',
        role: 'superadmin',
        avatarUrl:
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
      };

      setAdminSession(mockUser);
      setUser(mockUser);
      setIsLoading(false);
      toast.success(`Welcome back, ${mockUser.name}!`);
      router.push('/admin/dashboard');
      return true;
    },
    [router]
  );

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    // Simulate Google OAuth handshake
    await new Promise((r) => setTimeout(r, 800));

    const googleUser: AdminUser = {
      id: 'google-usr-' + Date.now(),
      email: 'admin.marchie@atbpcollaborative.com',
      name: 'Marchie Teodoro Borja',
      role: 'superadmin',
      avatarUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    };

    setAdminSession(googleUser);
    setUser(googleUser);
    setIsLoading(false);
    toast.success('Successfully authenticated with Google OAuth');
    router.push('/admin/dashboard');
    return true;
  }, [router]);

  const logout = useCallback(() => {
    clearAdminSession();
    setUser(null);
    toast.info('Signed out of administration console');
    router.push('/admin/login');
  }, [router]);

  return {
    user,
    isLoading,
    loginWithCredentials,
    loginWithGoogle,
    logout,
  };
}
