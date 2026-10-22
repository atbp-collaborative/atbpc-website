/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, ChevronDown, ChevronUp, UserCheck, KeyRound } from 'lucide-react';
import { AdminRole } from '@/types';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import Link from 'next/link';

export const DevRoleSwitcher: React.FC = () => {
  const isGatePassActive = process.env.NEXT_PUBLIC_GATE_PASS === 'true';
  const { user, setSimulatedRole } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isGatePassActive) {
    return null;
  }

  const currentRole: AdminRole = user?.role || 'superadmin';

  const roles: { role: AdminRole; label: string; desc: string; color: string }[] = [
    {
      role: 'superadmin',
      label: 'Super Admin',
      desc: 'Full CRUD + Account creation',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      role: 'admin',
      label: 'Admin',
      desc: 'CRU People/Projects/CMS (No Delete)',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      role: 'editor',
      label: 'Editor',
      desc: 'RU Projects Only',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <aside
      aria-label="Development Mode Gate Pass Panel"
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 text-micro font-mono select-none"
    >
      {isOpen && (
        <div className="p-3 rounded-xl border border-white/20 bg-vintage-charcoal/95 backdrop-blur-md text-bright-gray shadow-2xl w-64 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-space-sparkle">
              <Sparkles size={14} /> Gate Pass Active
            </div>
            <span className="text-[10px] text-white/50">RBAC Dev Switcher</span>
          </div>

          <p className="text-[11px] font-sans opacity-75 leading-tight">
            Switch permissions to test UI visibility across the three tiers:
          </p>

          <div className="space-y-1.5">
            {roles.map((r) => {
              const isSelected = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => {
                    setSimulatedRole(r.role);
                  }}
                  className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? `${r.color} font-bold ring-1 ring-space-sparkle`
                      : 'border-white/10 hover:bg-white/5 opacity-80 hover:opacity-100 text-white/80'
                  }`}
                >
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      <Shield size={12} /> {r.label}
                    </div>
                    <div className="text-[10px] font-sans opacity-60 font-normal">{r.desc}</div>
                  </div>
                  {isSelected && <UserCheck size={14} className="shrink-0 text-space-sparkle" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <Link
              href="/admin/login/turn-over"
              className="text-space-sparkle hover:underline flex items-center gap-1"
            >
              <KeyRound size={12} /> Test Handover Ceremony
            </Link>
          </div>
        </div>
      )}

      {/* Toggle Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-space-sparkle/40 bg-vintage-charcoal/90 text-bright-gray shadow-lg hover:border-space-sparkle transition-all cursor-pointer backdrop-blur-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold uppercase tracking-wider text-[11px]">
          Gate Pass: <span className="text-space-sparkle">{currentRole}</span>
        </span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
    </aside>
  );
};
