/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Trash2,
  Edit2,
  ShieldCheck,
  Shield,
  KeyRound,
  MailCheck,
  Clock,
  Send,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';
import {
  fetchSuperPanelAccountsAction,
  deleteSuperPanelAccountAction,
  resendAccountVerificationAction,
  SuperPanelAccount,
} from '@/app/actions/super-panel-actions';
import { CreateAdminAccountModal } from './CreateAdminAccountModal';
import { EditAdminAccountModal } from './EditAdminAccountModal';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { toast } from 'sonner';

export const AdminAccountsTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  const [accounts, setAccounts] = useState<SuperPanelAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<SuperPanelAccount | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<SuperPanelAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);

  const loadAccounts = async () => {
    setIsLoading(true);
    const data = await fetchSuperPanelAccountsAction();
    setAccounts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    setIsDeleting(true);

    const result = await deleteSuperPanelAccountAction(accountToDelete.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success(`Account for "${accountToDelete.alias}" has been revoked.`);
      setAccounts((prev) => prev.filter((a) => a.id !== accountToDelete.id));
      setAccountToDelete(null);
    } else {
      toast.error(result.error || 'Failed to delete account.');
    }
  };

  const handleResendVerification = async (email: string) => {
    setResendingEmail(email);
    const result = await resendAccountVerificationAction(email);
    setResendingEmail(null);

    if (result.success) {
      toast.success(`Verification link resent to ${email}.`);
    } else {
      toast.error(result.error || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle font-semibold block">
            Administrative Governance
          </span>
          <h2 className="text-h2 font-major font-bold tracking-tight lowercase">
            administrative accounts &amp; rbac
          </h2>
          <p className="text-caption font-light opacity-70">
            Provision, manage tiers, and supervise access for studio admins and project editors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="ghost"
            onClick={loadAccounts}
            disabled={isLoading}
            className="!p-2.5 text-mini shrink-0 cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </Button>

          <Button
            type="filled"
            onClick={() => setIsCreateOpen(true)}
            className="!py-2.5 px-4 text-mini font-semibold shrink-0 cursor-pointer"
          >
            <UserPlus size={15} className="mr-2 inline" /> Provision Admin Account
          </Button>
        </div>
      </div>

      {/* Accounts List Table */}
      <div
        className={`rounded-xl border overflow-hidden shadow-xs transition-colors ${
          isDarkMode ? 'bg-vintage-charcoal/80 border-white/10' : 'bg-white border-black/10'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-mini">
            <thead>
              <tr
                className={`border-b text-micro uppercase tracking-wider font-mono ${
                  isDarkMode
                    ? 'border-white/10 bg-white/5 text-bright-gray/60'
                    : 'border-black/10 bg-black/5 text-vintage-charcoal/60'
                }`}
              >
                <th className="py-3 px-4">Admin Alias</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Administrative Tier</th>
                <th className="py-3 px-4">Email Verification</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-caption opacity-50">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-space-sparkle" />
                    Loading studio accounts...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-caption opacity-50">
                    No administrative accounts found.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => {
                  const isSuperadmin = acc.role === 'superadmin';

                  return (
                    <tr
                      key={acc.id}
                      className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      {/* Alias */}
                      <td className="py-3.5 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-micro ${
                              isSuperadmin
                                ? 'bg-space-sparkle/20 text-space-sparkle'
                                : acc.role === 'admin'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {acc.alias.charAt(0).toUpperCase()}
                          </div>
                          <span>{acc.alias}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-mono text-micro opacity-80">
                        {acc.email}
                      </td>

                      {/* Role Tier */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider font-mono border ${
                            isSuperadmin
                              ? 'bg-space-sparkle/15 text-space-sparkle border-space-sparkle/30'
                              : acc.role === 'admin'
                              ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          <Shield size={11} />
                          {acc.role}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        {acc.isEmailConfirmed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <MailCheck size={11} />
                            Verified
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              <Clock size={11} />
                              Pending Verification
                            </span>
                            <button
                              type="button"
                              onClick={() => handleResendVerification(acc.email)}
                              disabled={resendingEmail === acc.email}
                              className="text-[10px] text-space-sparkle hover:underline cursor-pointer flex items-center gap-0.5"
                              title="Resend Verification Link"
                            >
                              <Send size={10} />
                              <span>{resendingEmail === acc.email ? 'Sending...' : 'Resend'}</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-micro opacity-60 font-mono">
                        {acc.createdAt ? new Date(acc.createdAt).toLocaleDateString() : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isSuperadmin ? (
                          <span className="text-micro font-mono opacity-40 italic">
                            Protected (Superadmin)
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setAccountToEdit(acc)}
                              className="p-1.5 rounded-md hover:bg-space-sparkle/15 text-space-sparkle transition-colors cursor-pointer"
                              title="Edit Alias or Role Tier"
                            >
                              <Edit2 size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setAccountToDelete(acc)}
                              className="p-1.5 rounded-md hover:bg-red-500/15 text-red-400 transition-colors cursor-pointer"
                              title="Revoke Account"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Account Modal */}
      <CreateAdminAccountModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newAcc) => {
          setAccounts((prev) => [newAcc, ...prev]);
        }}
      />

      {/* Edit Account Modal */}
      <EditAdminAccountModal
        isOpen={Boolean(accountToEdit)}
        account={accountToEdit}
        onClose={() => setAccountToEdit(null)}
        onUpdated={({ id, alias, role }) => {
          setAccounts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, alias, role } : a))
          );
        }}
      />

      {/* Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={Boolean(accountToDelete)}
        title="Revoke Admin Account"
        description={`Are you sure you want to revoke and delete the account for "${accountToDelete?.alias}" (${accountToDelete?.email})? This user will immediately lose access to the studio administration dashboard.`}
        confirmLabel="Revoke Account"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setAccountToDelete(null)}
      />
    </div>
  );
};
