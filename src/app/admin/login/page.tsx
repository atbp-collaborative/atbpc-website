/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { AtbpLogo } from '@/components/global/AtbpLogo';
import { Button } from '@/components/primitives/buttons/Button';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { TwoFactorSetupModal } from '@/components/admin/TwoFactorSetupModal';
import { TwoFactorChallengeModal } from '@/components/admin/TwoFactorChallengeModal';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useTheme();
  const {
    loginWithCredentials,
    isLoading,
    is2FASetupOpen,
    setIs2FASetupOpen,
    is2FAChallengeOpen,
    totpFactorId,
    complete2FAChallenge,
    cancel2FAChallenge,
  } = useAdminAuth();

  const isGatePass = process.env.NEXT_PUBLIC_GATE_PASS === 'true';

  // Blank initial inputs on first load
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Check if redirected from email verification
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success('Email confirmed successfully! Please sign in to access your dashboard.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    await loginWithCredentials(email, password);
  };

  const handleBypass = () => {
    router.push('/admin/dashboard');
  };

  const inputClass = `w-full text-caption px-3.5 py-2.5 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle focus:ring-1 focus:ring-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle focus:ring-1 focus:ring-space-sparkle'
  }`;

  return (
    <>
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        {/* Main Login Card */}
        <div
          className={`p-6 sm:p-8 rounded-xl border shadow-xl backdrop-blur-md space-y-6 ${
            isDarkMode
              ? 'bg-vintage-charcoal/90 border-space-sparkle/30 text-bright-gray'
              : 'bg-white border-space-sparkle/20 text-vintage-charcoal'
          }`}
        >
          {/* Header with official AtbpLogo */}
          <div className="space-y-2 text-center">
            <AtbpLogo isDarkMode={isDarkMode} className="h-8 w-auto mx-auto mb-2" />
            <h2 className="text-h1 font-major font-bold tracking-tight lowercase text-bright-gray/90">
              admin dashboard
            </h2>
            <p className="text-caption font-light opacity-70">
              Sign in to manage projects, people, and studio content.
            </p>
          </div>

          {/* Gate Pass Notice */}
          {isGatePass && (
            <div
              className={`p-3 rounded-lg border text-mini flex items-center justify-between gap-2 ${
                isDarkMode
                  ? 'bg-space-sparkle/10 border-space-sparkle/30 text-bright-gray'
                  : 'bg-space-sparkle/5 border-space-sparkle/20 text-vintage-charcoal'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles size={14} className="text-space-sparkle shrink-0" />
                <span className="truncate">Gate Pass (Dev Mode) is active</span>
              </div>
              <button
                type="button"
                onClick={handleBypass}
                className="text-micro font-semibold text-space-sparkle underline shrink-0 hover:opacity-80 cursor-pointer"
              >
                Skip to Dashboard →
              </button>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-micro font-semibold uppercase tracking-wider opacity-70 block">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@atbpcollaborative.com"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-micro font-semibold uppercase tracking-wider opacity-70 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-mini">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded accent-space-sparkle"
                />
                <span className="opacity-80">Remember session</span>
              </label>

              <span className="text-micro opacity-50 font-mono">Restricted Access</span>
            </div>

            <Button
              type="filled"
              htmlType="submit"
              disabled={isLoading}
              fullWidth
              className="!py-3 text-caption font-semibold mt-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={15} className="ml-1 inline" />
            </Button>
          </form>
        </div>

        <p className="text-center text-micro opacity-40 mt-6 font-mono">
          ATBP Collaborative
        </p>
      </div>

      {/* 2FA Login Challenge Modal */}
      <TwoFactorChallengeModal
        isOpen={is2FAChallengeOpen}
        factorId={totpFactorId}
        onSuccess={complete2FAChallenge}
        onCancel={cancel2FAChallenge}
      />

      {/* Mandatory 2FA TOTP Enrollment Modal */}
      <TwoFactorSetupModal
        isOpen={is2FASetupOpen}
        canSkip={isGatePass}
        onSkip={() => setIs2FASetupOpen(false)}
        onComplete={() => {
          setIs2FASetupOpen(false);
          router.push('/admin/dashboard');
        }}
      />
    </>
  );
}
