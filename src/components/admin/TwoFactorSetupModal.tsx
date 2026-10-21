/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Copy, Check, KeyRound, Loader2 } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
  canSkip?: boolean;
  onSkip?: () => void;
}

export const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({
  isOpen,
  onComplete,
  canSkip = false,
  onSkip,
}) => {
  const [factorId, setFactorId] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const startEnrollment = async () => {
      setIsEnrolling(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          issuer: 'ATBP Collaborative',
        });

        if (error) {
          console.warn('[TwoFactorSetupModal] MFA enroll error:', error);
          toast.error(error.message || 'Failed to initialize 2FA enrollment.');
          setIsEnrolling(false);
          return;
        }

        if (isMounted && data) {
          setFactorId(data.id);
          setQrCode(data.totp.qr_code);
          setSecret(data.totp.secret);
        }
      } catch (err: any) {
        console.error('[TwoFactorSetupModal] Exception enrolling MFA:', err);
        toast.error('Could not initialize 2FA authenticator enrollment.');
      } finally {
        if (isMounted) setIsEnrolling(false);
      }
    };

    startEnrollment();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.info('Secret copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy secret.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      toast.error('Please enter the 6-digit authentication code.');
      return;
    }

    setIsVerifying(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: code.trim(),
      });

      if (error) {
        toast.error(error.message || 'Invalid 6-digit code. Please try again.');
        setIsVerifying(false);
        return;
      }

      setIsSuccess(true);
      toast.success('Two-factor authentication successfully configured!');
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (err: any) {
      toast.error(err?.message || 'Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 sm:p-7 rounded-2xl border border-space-sparkle/40 bg-vintage-charcoal text-bright-gray shadow-2xl space-y-5">
        <div className="text-center space-y-1.5">
          <div className="w-14 h-14 mx-auto rounded-full bg-space-sparkle/20 text-space-sparkle flex items-center justify-center mb-1">
            <ShieldCheck size={30} />
          </div>
          <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle block font-semibold">
            Mandatory Security Policy
          </span>
          <h3 className="text-h2 font-major font-bold tracking-tight lowercase">
            {isSuccess ? '2fa verified' : 'setup two-factor auth'}
          </h3>
          <p className="text-caption font-light opacity-75 leading-relaxed">
            {isSuccess
              ? 'Your authenticator is verified. Studio dashboard access is now unlocked.'
              : 'Scan the QR code with your authenticator app (Google Authenticator, Apple Passwords, or 1Password).'}
          </p>
        </div>

        {isSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center space-y-1">
            <ShieldCheck size={28} className="mx-auto" />
            <p className="text-caption font-semibold">Account Secured</p>
            <p className="text-micro opacity-80">Opening studio dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white text-vintage-charcoal border border-white/20">
              {isEnrolling ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-vintage-charcoal/70">
                  <Loader2 size={24} className="animate-spin text-space-sparkle" />
                  <span className="text-micro font-mono">Generating secure QR code...</span>
                </div>
              ) : qrCode ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrCode}
                  alt="2FA QR Code"
                  className="w-44 h-44 object-contain rounded"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-micro">
                  <KeyRound size={24} className="mb-2 opacity-50" />
                  <span>Manual key provisioning ready below</span>
                </div>
              )}
            </div>

            {/* Secret key manual fallback */}
            {secret && (
              <div className="space-y-1">
                <span className="text-micro opacity-60 uppercase font-mono block">
                  Manual Entry Key
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/10 text-mini font-mono">
                  <span className="tracking-wider text-space-sparkle select-all break-all">
                    {secret}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="p-1 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                    title="Copy Secret"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* Verification code input */}
            <div className="space-y-1">
              <label className="text-micro font-semibold uppercase tracking-wider opacity-75 block">
                6-Digit Authenticator Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                pattern="[0-9]{6}"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full text-center text-h2 font-mono tracking-[0.3em] py-2 rounded-lg border border-space-sparkle/40 bg-vintage-charcoal/80 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-space-sparkle"
              />
            </div>

            <Button
              type="filled"
              htmlType="submit"
              disabled={isVerifying || code.length !== 6}
              fullWidth
              className="!py-3 text-caption font-semibold"
            >
              <span>{isVerifying ? 'Verifying Code...' : 'Verify & Unlock Dashboard'}</span>
              <ArrowRight size={15} className="ml-1 inline" />
            </Button>

            {canSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="w-full text-center text-micro text-white/50 hover:text-white pt-1 transition-colors cursor-pointer"
              >
                Skip for now (Gate Pass Active) →
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
