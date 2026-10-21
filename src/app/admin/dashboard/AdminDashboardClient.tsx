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
  ShieldCheck,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/primitives/buttons/Button';
import { useAdminPeople } from '@/hooks/admin/useAdminPeople';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { useAdminRoles } from '@/hooks/admin/useAdminRoles';
import { useAdminGeneralInfo, AdminGeneralInfoInitialData } from '@/hooks/admin/useAdminGeneralInfo';
import { useTheme } from '@/context/ThemeContext';
import { Member, Project, Role } from '@/types';

interface AdminDashboardClientProps {
  initialMembers?: Member[];
  initialProjects?: Project[];
  initialRoles?: Role[];
  initialGeneralInfo?: AdminGeneralInfoInitialData;
}

export function AdminDashboardClient({
  initialMembers,
  initialProjects,
  initialRoles,
  initialGeneralInfo,
}: AdminDashboardClientProps) {
  const { isDarkMode } = useTheme();
  const { members } = useAdminPeople(initialMembers);
  const { projects } = useAdminProjects(initialProjects);
  const { roles } = useAdminRoles(initialRoles ? { roles: initialRoles } : undefined);
  const { contactInfo, privacyPolicy, legalNotices } = useAdminGeneralInfo(initialGeneralInfo);

  // Metrics
  const totalMembers = members.length;
  const publishedMembers = members.filter((m) => !m.isDraft).length;
  const draftMembers = members.filter((m) => m.isDraft).length;

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => !p.isDraft).length;
  const draftProjects = projects.filter((p) => p.isDraft).length;

  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const ongoingProjects = projects.filter((p) => p.status === 'ongoing').length;

  const cardClass = `p-5 sm:p-6 rounded-xl border transition-all ${
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
            <Link href="/admin/roles">
              <Button
                type={isDarkMode ? 'outline' : 'filled'}
                className="!py-2 !px-4 text-mini"
              >
                <ShieldCheck size={14} className="mr-1 inline" /> Manage Roles
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row min-[1340px]:flex-row gap-2 justify-between text-mini">
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

          {/* Roles Card */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-space-sparkle/15 text-space-sparkle flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <Link
                href="/admin/roles"
                className="text-micro font-semibold text-space-sparkle hover:underline flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-micro uppercase font-mono tracking-wider opacity-60">
                Studio Roles
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-hero font-bold font-major">{roles.length}</span>
                <span className="text-mini opacity-60">catalog roles</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row min-[1340px]:flex-row gap-2 justify-between text-mini">
              <div className="flex items-center gap-1.5 text-space-sparkle">
                <span>{roles.filter((r) => r.track === 'professionals').length} Pro Tracks</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <span>{roles.filter((r) => r.track === 'internship').length} Internships</span>
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
                Projects
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-hero font-bold font-major">{totalProjects}</span>
                <span className="text-mini opacity-60">entries</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row min-[1340px]:flex-row gap-2 justify-between text-mini">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} />
                <span>{completedProjects} Built</span>
              </div>
              <div className="flex items-center gap-1.5 text-space-sparkle">
                <Clock size={13} />
                <span>{ongoingProjects} Ongoing</span>
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
                Studio Specs
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-hero font-bold font-major">
                  {contactInfo ? 'Active' : 'Standby'}
                </span>
                <span className="text-mini opacity-60">system sync</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row min-[1340px]:flex-row gap-2 justify-between text-mini">
              <div className="flex items-center gap-1.5 opacity-75">
                <Building size={13} />
                <span>QC Studio</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-75">
                <span>{privacyPolicy?.sections?.length || 5} Policies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects Table & Shortcuts Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Recent Projects Showcase */}
          <div className={`lg:col-span-2 ${cardClass} space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
              <h3 className="font-major text-h2 font-semibold lowercase">
                recent portfolio projects
              </h3>
              <Link
                href="/admin/projects"
                className="text-mini font-semibold text-space-sparkle hover:underline flex items-center gap-1"
              >
                <span>View all ({totalProjects})</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 text-center opacity-60 text-caption">
                No projects found. Add your first architectural entry.
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="p-3 rounded-lg border border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-md overflow-hidden bg-black/10 dark:bg-white/10 shrink-0 relative">
                        {project.images && project.images[0] ? (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-micro opacity-40 font-mono">
                            N/A
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="font-semibold text-caption block">
                          {project.title}
                        </span>
                        <span className="text-micro opacity-60 font-mono uppercase tracking-wider">
                          {project.category || project.mainCategory} • {project.year} • {project.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span
                        className={`px-2 py-0.5 rounded text-micro font-mono uppercase tracking-wider font-semibold ${
                          project.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-space-sparkle/10 text-space-sparkle'
                        }`}
                      >
                        {project.status}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-micro font-mono uppercase tracking-wider font-semibold ${
                          project.isDraft
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {project.isDraft ? 'Draft' : 'Live'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Quick Studio Actions */}
          <div className="space-y-5">
            <div className={cardClass}>
              <h3 className="font-major text-h2 font-semibold lowercase mb-3 pb-2 border-b border-black/5 dark:border-white/10">
                system status
              </h3>
              <div className="space-y-3 text-caption">
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Supabase Connection</span>
                  <span className="text-emerald-500 flex items-center gap-1 font-mono text-micro font-bold">
                    <CheckCircle2 size={12} /> Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Published Portfolio</span>
                  <span className="font-mono text-micro font-bold">{publishedProjects} Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Staged Drafts</span>
                  <span className="font-mono text-micro font-bold text-amber-500">
                    {draftProjects + draftMembers} Pending
                  </span>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="font-major text-h2 font-semibold lowercase mb-3 pb-2 border-b border-black/5 dark:border-white/10">
                public preview
              </h3>
              <p className="text-mini opacity-70 mb-4 leading-relaxed">
                Preview your active studio changes live on the public presentation pages.
              </p>
              <div className="space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-black/5 dark:border-white/10 hover:border-space-sparkle transition-colors text-caption group"
                >
                  <span>Homepage & Carousel</span>
                  <ExternalLink size={13} className="opacity-60 group-hover:opacity-100" />
                </Link>
                <Link
                  href="/works"
                  target="_blank"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-black/5 dark:border-white/10 hover:border-space-sparkle transition-colors text-caption group"
                >
                  <span>Works Gallery</span>
                  <ExternalLink size={13} className="opacity-60 group-hover:opacity-100" />
                </Link>
                <Link
                  href="/studio/our-people"
                  target="_blank"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-black/5 dark:border-white/10 hover:border-space-sparkle transition-colors text-caption group"
                >
                  <span>Team Bios</span>
                  <ExternalLink size={13} className="opacity-60 group-hover:opacity-100" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
