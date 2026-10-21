/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { X, Mail, User, Shield, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';
import { createSuperPanelAccountAction, SuperPanelAccount } from '@/app/actions/super-panel-actions';
import { toast } from 'sonner';

interface CreateAdminAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newUser: SuperPanelAccount) => void;
}

export const CreateAdminAccountModal: React.FC<CreateAdminAccountModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { isDarkMode } = useTheme();

  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor'>('admin');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!alias.trim() || !email.trim() || !password) {
      toast.error('All fields are required.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await createSuperPanelAccountAction({
      alias: alias.trim(),
      email: email.trim(),
      role,
      password,
    });
    setIsSubmitting(false);

    if (result.success && result.account) {
      toast.success(
        `Account for "${alias}" created! A confirmation email has been sent to ${email}.`
      );
      onCreated(result.account);
      onClose();
    } else {
      toast.error(result.error || 'Failed to create account.');
    }
  };

  const inputClass = `w-full text-caption px-3.5 py-2.5 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle focus:ring-1 focus:ring-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle focus:ring-1 focus:ring-space-sparkle'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-5 transition-colors ${
          isDarkMode
            ? 'bg-vintage-charcoal border-white/10 text-bright-gray'
            : 'bg-white border-black/10 text-vintage-charcoal'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div>
            <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle font-semibold block">
              Super Admin Panel
            </span>
            <h3 className="text-h3 font-major font-bold tracking-tight lowercase">
              provision admin account
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin Alias */}
          <div className="space-y-1">
            <label className="text-micro font-semibold uppercase tracking-wider opacity-70 block">
              Admin Alias
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
              />
              <input
                type="text"
                required
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="e.g. Studio Lead / Arch. Christian"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          {/* Email Address */}
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
                placeholder="team@atbpcollaborative.com"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          {/* Administrative Tier */}
          <div className="space-y-1">
            <label className="text-micro font-semibold uppercase tracking-wider opacity-70 block">
              Administrative Tier (Role)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  role === 'admin'
                    ? 'border-space-sparkle bg-space-sparkle/10 font-bold ring-1 ring-space-sparkle text-space-sparkle'
                    : 'border-black/10 dark:border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="text-caption font-semibold flex items-center gap-1.5">
                  <Shield size={14} /> Admin
                </div>
                <div className="text-[10px] font-sans opacity-70 font-normal mt-1 leading-snug">
                  Can create, modify People, Projects, Contents (no delete capabilities)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('editor')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  role === 'editor'
                    ? 'border-space-sparkle bg-space-sparkle/10 font-bold ring-1 ring-space-sparkle text-space-sparkle'
                    : 'border-black/10 dark:border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="text-caption font-semibold flex items-center gap-1.5">
                  <Shield size={14} /> Editor
                </div>
                <div className="text-[10px] font-sans opacity-70 font-normal mt-1 leading-snug">
                  Can only modify projects (no create and delete capabilities)
                </div>
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-micro font-semibold uppercase tracking-wider opacity-70 block">
              Initial Password (min. 8 chars)
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
                placeholder="••••••••••••"
                className={`${inputClass} pl-9`}
              />
            </div>
            <p className="text-[10px] opacity-60">
              A verification email will be dispatched. The account cannot log in until confirmed.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-mini px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="filled"
              htmlType="submit"
              disabled={isSubmitting}
              className="text-mini px-5 py-2 font-semibold"
            >
              <span>{isSubmitting ? 'Creating...' : 'Provision Account'}</span>
              <ArrowRight size={14} className="ml-1 inline" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
