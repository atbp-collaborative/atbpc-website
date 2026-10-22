/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface TwoFactorChallengeModalProps {
  isOpen: boolean;
  factorId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TwoFactorChallengeModal: React.FC<TwoFactorChallengeModalProps> = ({
  isOpen,
  factorId,
  onSuccess,
  onCancel,
}) => {
  const [code, setCode] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setCode('');
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      toast.error('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!factorId) {
      toast.error('Missing authenticator factor. Please try logging in again.');
      onCancel();
      return;
    }

    setIsVerifying(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: cleanCode,
      });

      if (error) {
        toast.error(error.message || 'Invalid authentication code. Please check your authenticator app.');
        setCode('');
        inputRef.current?.focus();
        setIsVerifying(false);
        return;
      }

      toast.success('Two-factor authentication verified.');
      onSuccess();
    } catch (err: any) {
      console.error('[TwoFactorChallengeModal] Verification error:', err);
      toast.error(err?.message || 'Verification failed. Please try again.');
      setCode('');
      inputRef.current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(val);

    // Auto-submit once 6 digits are typed or pasted
    if (val.length === 6 && !isVerifying) {
      setTimeout(() => {
        // Trigger verification directly
        const supabase = createClient();
        setIsVerifying(true);
        supabase.auth.mfa
          .challengeAndVerify({
            factorId,
            code: val,
          })
          .then(({ error }) => {
            if (error) {
              toast.error(error.message || 'Invalid authentication code. Please check your authenticator app.');
              setCode('');
              inputRef.current?.focus();
              setIsVerifying(false);
            } else {
              toast.success('Two-factor authentication verified.');
              onSuccess();
            }
          })
          .catch((err: any) => {
            console.error('[TwoFactorChallengeModal] Auto-verify error:', err);
            toast.error(err?.message || 'Verification failed. Please try again.');
            setCode('');
            inputRef.current?.focus();
            setIsVerifying(false);
          });
      }, 50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-space-sparkle/40 bg-vintage-charcoal text-bright-gray shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-space-sparkle/20 text-space-sparkle flex items-center justify-center mb-1">
            <ShieldCheck size={30} />
          </div>
          <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle block font-semibold">
            Two-Factor Challenge
          </span>
          <h3 className="text-h2 font-major font-bold tracking-tight lowercase">
            verify your identity
          </h3>
          <p className="text-caption font-light opacity-75 leading-relaxed">
            Enter the 6-digit verification code from your authenticator app to access the admin dashboard.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-micro font-semibold uppercase tracking-wider opacity-75">
              <span>Security Code</span>
              <span className="text-[10px] font-mono opacity-60 lowercase flex items-center gap-1">
                <KeyRound size={11} /> 6 digits
              </span>
            </div>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={isVerifying}
              required
              maxLength={6}
              value={code}
              onChange={handleChange}
              placeholder="••••••"
              className="w-full text-center text-h1 font-mono tracking-[0.4em] py-3 rounded-xl border border-space-sparkle/40 bg-black/40 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-space-sparkle focus:border-space-sparkle transition-all disabled:opacity-50"
            />
          </div>

          <Button
            type="filled"
            htmlType="submit"
            disabled={isVerifying || code.length !== 6}
            fullWidth
            className="!py-3.5 text-caption font-semibold cursor-pointer"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin text-vintage-charcoal" />
                <span>Verifying Security Code...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <span>Verify & Proceed to Dashboard</span>
                <ArrowRight size={15} />
              </span>
            )}
          </Button>

          {/* Cancel & Sign Out Option */}
          <div className="pt-2 border-t border-white/5 text-center">
            <button
              type="button"
              onClick={onCancel}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 text-mini text-white/50 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
            >
              <LogOut size={13} />
              <span>Cancel and sign out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
