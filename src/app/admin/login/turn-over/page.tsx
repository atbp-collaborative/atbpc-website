/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LockKeyhole,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { AtbpLogo } from '@/components/global/AtbpLogo';
import { Button } from '@/components/primitives/buttons/Button';
import {
  checkSuperadminExistsAction,
  verifyTurnoverCodeAction,
  completeTurnoverAction,
  resendTurnoverVerificationAction,
} from '@/app/actions/turnover-actions';
import { toast } from 'sonner';

export default function TurnoverCeremonyPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [step, setStep] = useState<'code' | 'nomination' | 'verification_pending'>('code');

  const [code, setCode] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verification timer (15 minutes = 900 seconds)
  const [countdownSeconds, setCountdownSeconds] = useState(15 * 60);
  const [isResending, setIsResending] = useState(false);

  // Check on mount if a Superadmin already exists
  useEffect(() => {
    async function verifyInitialStatus() {
      try {
        const result = await checkSuperadminExistsAction();
        if (result.isSuperadminExisting) {
          if (result.isPendingVerification && result.remainingMs) {
            // Already pending verification within the 15-min window
            setEmail(result.pendingEmail || '');
            setCountdownSeconds(Math.max(10, Math.floor(result.remainingMs / 1000)));
            setStep('verification_pending');
          } else {
            // Fully confirmed Superadmin exists
            setIsLocked(true);
          }
        }
      } catch (err) {
        console.error('Error checking turnover status:', err);
      } finally {
        setIsLoading(false);
      }
    }
    verifyInitialStatus();
  }, []);

  // 15-minute countdown interval
  useEffect(() => {
    if (step !== 'verification_pending') return;

    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('The 15-minute verification window has expired. Please restart the turnover ceremony.');
          setStep('code');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Step 1: Verify Turnover Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Please enter the turnover code.');
      return;
    }

    setIsVerifyingCode(true);
    const result = await verifyTurnoverCodeAction(code.trim());
    setIsVerifyingCode(false);

    if (result.success) {
      toast.success('Turnover code verified.');
      setStep('nomination');
    } else {
      toast.error(result.message || 'Invalid turnover code.');
    }
  };

  // Step 2: Nominate Superadmin
  const handleNominateSuperadmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await completeTurnoverAction({
      code: code.trim(),
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Verification email dispatched.');
      setCountdownSeconds(15 * 60);
      setStep('verification_pending');
    } else {
      toast.error(result.message || 'Failed to nominate Superadmin account.');
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setIsResending(true);
    const result = await resendTurnoverVerificationAction(email);
    setIsResending(false);

    if (result.success) {
      toast.success('Verification email resent. Please check your inbox.');
    } else {
      toast.error(result.message || 'Failed to resend email.');
    }
  };

  const inputClass = `w-full text-caption px-3.5 py-2.5 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle focus:ring-1 focus:ring-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle focus:ring-1 focus:ring-space-sparkle'
  }`;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-space-sparkle border-t-transparent animate-spin" />
        <span className="text-micro font-mono tracking-widest uppercase opacity-60">
          Verifying Handover Gateway...
        </span>
      </div>
    );
  }

  // Permanent Lockout View
  if (isLocked) {
    return (
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <LockKeyhole size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-h2 font-major font-bold tracking-tight lowercase">
            handover ceremony concluded
          </h2>
          <p className="text-caption font-light opacity-70">
            A Studio Superadmin has already been enrolled for ATBP Collaborative. For security, the
            turnover ceremony gateway is permanently closed.
          </p>
        </div>
        <div className="pt-2">
          <Button
            type="filled"
            onClick={() => router.push('/admin/login')}
            className="!py-2.5 px-6 text-mini font-semibold"
          >
            Go to Admin Sign In <ArrowRight size={14} className="ml-1 inline" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      {/* Main Card */}
      <div
        className={`p-6 sm:p-8 rounded-xl border shadow-xl backdrop-blur-md space-y-6 ${
          isDarkMode
            ? 'bg-vintage-charcoal/90 border-space-sparkle/30 text-bright-gray'
            : 'bg-white border-space-sparkle/20 text-vintage-charcoal'
        }`}
      >
        {/* Step Indicator Header with Official AtbpLogo */}
        <div className="space-y-2 text-center">
          <AtbpLogo isDarkMode={isDarkMode} className="h-8 w-auto mx-auto mb-2" />

          <h2 className="text-h2 font-major font-bold tracking-tight lowercase">
            {step === 'code' && 'website turn-over ceremony'}
            {step === 'nomination' && 'superadmin enrollment'}
            {step === 'verification_pending' && 'verify your email'}
          </h2>

          <p className="text-caption font-light opacity-75">
            {step === 'code' && 'The website is waiting for your arrival, Architect!'}
            {step === 'nomination' &&
              'Nominate your primary email and password. Your account will automatically receive highest-tier Superadmin authority.'}
            {step === 'verification_pending' &&
              'We have dispatched an activation link to your nominated email.'}
          </p>
        </div>

        {/* STEP 1: Code Verification */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-micro font-semibold uppercase tracking-wider opacity-70 block">
                Turnover Code
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                />
                <input
                  type="password"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                  className={`${inputClass} pl-9 font-mono tracking-widest text-center text-body`}
                />
              </div>
            </div>

            <Button
              type="filled"
              htmlType="submit"
              disabled={isVerifyingCode || !code.trim()}
              fullWidth
              className="!py-3 text-caption font-semibold mt-3"
            >
              <span>{isVerifyingCode ? 'Verifying Code...' : 'Verify Code & Proceed'}</span>
              <ArrowRight size={15} className="ml-1 inline" />
            </Button>
          </form>
        )}

        {/* STEP 2: Superadmin Account Nomination */}
        {step === 'nomination' && (
          <form onSubmit={handleNominateSuperadmin} className="space-y-4 pt-1">
            <div className="p-3 rounded-lg border text-mini flex items-center gap-2 bg-space-sparkle/10 border-space-sparkle/30">
              <ShieldCheck size={16} className="text-space-sparkle shrink-0" />
              <div className="text-micro font-medium">
                Designated Role: <strong className="text-space-sparkle">Super Admin</strong> (Full
                CRUD &amp; Account Governance)
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-micro font-semibold uppercase tracking-wider opacity-70 block">
                Nominated Email Address
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
                  autoFocus
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-micro font-semibold uppercase tracking-wider opacity-70 block">
                Master Password (min. 8 characters)
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-micro font-semibold uppercase tracking-wider opacity-70 block">
                Confirm Master Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <Button
              type="filled"
              htmlType="submit"
              disabled={isSubmitting}
              fullWidth
              className="!py-3 text-caption font-semibold mt-3"
            >
              <span>{isSubmitting ? 'Establishing Authority...' : 'Create Superadmin Account'}</span>
              <ArrowRight size={15} className="ml-1 inline" />
            </Button>
          </form>
        )}

        {/* STEP 3: Email Verification Pending (15-Minute Window) */}
        {step === 'verification_pending' && (
          <div className="space-y-5 text-center pt-1">
            <div className="p-4 rounded-xl border space-y-2 bg-space-sparkle/10 border-space-sparkle/30">
              <div className="flex items-center justify-center gap-2 text-space-sparkle font-mono text-mini font-semibold">
                <Clock size={16} />
                <span>Verification Time Limit: {formatTimer(countdownSeconds)}</span>
              </div>
              <p className="text-caption font-semibold">
                Confirmation link dispatched to: <strong className="text-space-sparkle block mt-0.5">{email}</strong>
              </p>
              <p className="text-micro opacity-70">
                Please click the activation link in your inbox within 15 minutes to confirm ownership.
                After 15 minutes, this request expires and the turnover must be restarted.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending}
                className="text-micro font-mono text-space-sparkle hover:underline inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={13} />
                <span>{isResending ? 'Resending Link...' : 'Resend Verification Email'}</span>
              </button>
            </div>

            <Button
              type="filled"
              onClick={() => router.push('/admin/login')}
              fullWidth
              className="!py-3 text-caption font-semibold"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight size={15} className="ml-1 inline" />
            </Button>
          </div>
        )}
      </div>

      <p className="text-center text-micro opacity-40 mt-4 font-mono">
        ATBP Collaborative • Architecture &amp; Construction Governance
      </p>
    </div>
  );
}
