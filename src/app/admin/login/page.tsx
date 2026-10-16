/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/global/ThemeToggle';
import { Button } from '@/components/primitives/buttons/Button';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const { loginWithCredentials, loginWithGoogle, isLoading } = useAdminAuth();

  const [email, setEmail] = useState('admin@atbpcollaborative.com');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithCredentials(email, password);
  };

  const handleGoogleAuth = async () => {
    await loginWithGoogle();
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
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      {/* Top Bar with Brand and ThemeToggle */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-none bg-space-sparkle text-bright-gray flex items-center justify-center font-bold text-micro tracking-tighter">
            ATBP
          </div>
          <span className="font-major text-mini font-bold tracking-tight uppercase">
            Collaborative
          </span>
        </Link>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} className="!w-7 !h-7" />
      </div>

      {/* Main Login Card */}
      <div
        className={`p-6 sm:p-8 rounded-xl border shadow-xl backdrop-blur-md space-y-6 ${
          isDarkMode
            ? 'bg-vintage-charcoal/90 border-space-sparkle/30 text-bright-gray'
            : 'bg-white border-space-sparkle/20 text-vintage-charcoal'
        }`}
      >
        <div className="space-y-1.5 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-space-sparkle/15 text-space-sparkle flex items-center justify-center mb-2">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-h1 font-major font-bold tracking-tight lowercase">
            studio administration
          </h2>
          <p className="text-caption font-light opacity-70">
            Sign in to manage projects, people, and studio content.
          </p>
        </div>

        {/* Guest access notice */}
        <div
          className={`p-3 rounded-lg border text-mini flex items-center justify-between gap-2 ${
            isDarkMode
              ? 'bg-space-sparkle/10 border-space-sparkle/30 text-bright-gray'
              : 'bg-space-sparkle/5 border-space-sparkle/20 text-vintage-charcoal'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles size={14} className="text-space-sparkle shrink-0" />
            <span className="truncate">Guest / Dev Mode is enabled</span>
          </div>
          <button
            type="button"
            onClick={handleBypass}
            className="text-micro font-semibold text-space-sparkle underline shrink-0 hover:opacity-80 cursor-pointer"
          >
            Skip to Dashboard →
          </button>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className={`w-full py-2.5 px-4 rounded-lg border font-medium text-caption flex items-center justify-center gap-3 transition-all cursor-pointer ${
            isDarkMode
              ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
              : 'border-black/15 bg-black/5 hover:bg-black/10 text-vintage-charcoal'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-black/10 dark:border-white/10 w-full" />
          <span className="absolute bg-white dark:bg-vintage-charcoal px-3 text-micro uppercase tracking-wider opacity-50">
            or email and password
          </span>
        </div>

        {/* Traditional Credentials Form */}
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
                placeholder="admin@atbpcollaborative.com"
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

            <span className="text-micro opacity-50">Restricted Access</span>
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
        ATBP Collaborative • Architecture &amp; Construction Administration
      </p>
    </div>
  );
}
