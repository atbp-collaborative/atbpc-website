/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  FolderKanban,
  FileText,
  Plus,
  ArrowRight,
  Eye,
  EyeOff,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/primitives/buttons/Button';
import { useAdminPeople } from '@/hooks/admin/useAdminPeople';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { useAdminGeneralInfo } from '@/hooks/admin/useAdminGeneralInfo';
import { useTheme } from '@/context/ThemeContext';

export default function AdminDashboardPage() {
  const { isDarkMode } = useTheme();
  const { members } = useAdminPeople();
  const { projects } = useAdminProjects();
  const { contactInfo, privacyPolicy, legalNotices } = useAdminGeneralInfo();

  // Metrics
  const totalMembers = members.length;
  const publishedMembers = members.filter((m) => !m.isDraft).length;
  const draftMembers = members.filter((m) => m.isDraft).length;

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => !p.isDraft).length;
  const draftProjects = projects.filter((p) => p.isDraft).length;

  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const ongoingProjects = projects.filter((p) => p.status === 'ongoing').length;

  const cardClass = `p-6 rounded-xl border transition-all ${
    isDarkMode
      ? 'bg-vintage-charcoal/70 border-white/10 text-bright-gray'
      : 'bg-white border-black/10 text-vintage-charcoal shadow-xs'
  }`;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="studio overview"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]}
      />

      <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Welcome Banner */}
        <div
          className={`p-6 sm:p-8 rounded-xl border relative overflow-hidden ${
            isDarkMode
              ? 'bg-gradient-to-r from-space-sparkle/20 to-transparent border-space-sparkle/30'
              : 'bg-gradient-to-r from-space-sparkle/10 to-transparent border-space-sparkle/20'
          }`}
        >
          <div className="space-y-2 max-w-2xl relative z-10">
            <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle">
              ATBP Collaborative System
            </span>
            <h2 className="text-h1 font-major font-bold tracking-tight lowercase">
              welcome to the studio manager
            </h2>
            <p className="text-caption font-light opacity-80 leading-relaxed">
              Manage portfolio projects, team member bios and classifications, contact details,
              and legal policies. Staged drafts are hidden from the public website until you publish them.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/admin/people">
              <Button type="filled" className="!py-2 !px-4 text-mini">
                <Plus size={14} className="mr-1 inline" /> Manage People
              </Button>
            </Link>
            <Link href="/admin/projects">
              <Button
                type={isDarkMode ? 'outline' : 'filled'}
                className="!py-2 !px-4 text-mini"
              >
                <Plus size={14} className="mr-1 inline" /> Manage Projects
              </Button>
            </Link>
          </div>
        </div>

        {/* Primary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* People Card */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-space-sparkle/15 text-space-sparkle flex items-center justify-center">
                <Users size={20} />
              </div>
              <Link
                href="/admin/people"
                className="text-micro font-semibold text-space-sparkle hover:underline flex items-center gap-1"
              >
                <span>Directory</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-micro uppercase font-mono tracking-wider opacity-60">
                Team Members
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-hero font-bold font-major">{totalMembers}</span>
                <span className="text-mini opacity-60">profiles active</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-mini">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Eye size={13} />
                <span>{publishedMembers} Published</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <EyeOff size={13} />
                <span>{draftMembers} Drafts</span>
              </div>
            </div>
          </div>

          {/* Projects Card */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-space-sparkle/15 text-space-sparkle flex items-center justify-center">
                <FolderKanban size={20} />
              </div>
              <Link
                href="/admin/projects"
                className="text-micro font-semibold text-space-sparkle hover:underline flex items-center gap-1"
              >
                <span>Portfolio</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-micro uppercase font-mono tracking-wider opacity-60">
                Works &amp; Projects
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-hero font-bold font-major">{totalProjects}</span>
                <span className="text-mini opacity-60">projects total</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-mini">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} />
                <span>{completedProjects} Completed</span>
              </div>
              <div className="flex items-center gap-1.5 text-space-sparkle">
                <Clock size={13} />
                <span>{ongoingProjects} Ongoing</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <EyeOff size={13} />
                <span>{draftProjects} Drafts</span>
              </div>
            </div>
          </div>

          {/* General Info Card */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-space-sparkle/15 text-space-sparkle flex items-center justify-center">
                <FileText size={20} />
              </div>
              <Link
                href="/admin/general-info"
                className="text-micro font-semibold text-space-sparkle hover:underline flex items-center gap-1"
              >
                <span>Settings</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-micro uppercase font-mono tracking-wider opacity-60">
                Studio Information
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-hero font-bold font-major">4</span>
                <span className="text-mini opacity-60">content modules</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-1 text-mini opacity-80 truncate">
              <p className="truncate">
                <span className="font-semibold">HQ:</span> {contactInfo?.address?.slice(0, 36)}...
              </p>
              <p className="truncate">
                <span className="font-semibold">Inquiries:</span> {contactInfo?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links to Live Marketing Pages */}
        <div className="space-y-3">
          <h3 className="text-caption font-semibold uppercase tracking-wider opacity-70">
            Quick Navigation &amp; Verification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/studio/our-people"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 rounded-lg border flex items-center justify-between transition-all group ${
                isDarkMode ? 'bg-white/5 border-white/10 hover:border-space-sparkle' : 'bg-white border-black/10 hover:border-space-sparkle'
              }`}
            >
              <div className="space-y-0.5">
                <span className="font-semibold text-caption block">Public People Directory</span>
                <span className="text-micro font-mono opacity-50">/studio/our-people</span>
              </div>
              <ExternalLink size={14} className="text-space-sparkle group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/works"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 rounded-lg border flex items-center justify-between transition-all group ${
                isDarkMode ? 'bg-white/5 border-white/10 hover:border-space-sparkle' : 'bg-white border-black/10 hover:border-space-sparkle'
              }`}
            >
              <div className="space-y-0.5">
                <span className="font-semibold text-caption block">Public Works Portfolio</span>
                <span className="text-micro font-mono opacity-50">/works</span>
              </div>
              <ExternalLink size={14} className="text-space-sparkle group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 rounded-lg border flex items-center justify-between transition-all group ${
                isDarkMode ? 'bg-white/5 border-white/10 hover:border-space-sparkle' : 'bg-white border-black/10 hover:border-space-sparkle'
              }`}
            >
              <div className="space-y-0.5">
                <span className="font-semibold text-caption block">Studio Homepage</span>
                <span className="text-micro font-mono opacity-50">/</span>
              </div>
              <ExternalLink size={14} className="text-space-sparkle group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
