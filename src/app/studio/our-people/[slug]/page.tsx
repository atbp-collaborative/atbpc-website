'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Member, Project } from '@/types';
import { useTheme } from '@/lib/theme-context';
import { ROUTES, projectRoute } from '@/lib/navigation/routes';
import { hasNavigatedWithinApp } from '@/lib/navigation/nav-history';
import { Accordion } from '@/components/primitives/Accordion';
import { BreadcrumbButton } from '@/components/primitives/BreadcrumbButton';
import { ImageWithFade } from '@/components/primitives/ImageWithFade';
import { getMemberById } from '@/lib/services/members';
import { getProjects } from '@/lib/services/projects';

interface MemberDetailProps {
  member: Member;
  projects: Project[];
}

function MemberDetailContent({ member, projects }: MemberDetailProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  let breadcrumbLabel = 'People';
  if (from === 'designers') breadcrumbLabel = 'Designers';
  else if (from === 'managers') breadcrumbLabel = 'Managers';
  else if (from === 'builders') breadcrumbLabel = 'Builders';
  else if (from === 'all') breadcrumbLabel = 'People';
  else if (member.categories && member.categories.length > 0) {
    breadcrumbLabel = member.categories[0].charAt(0).toUpperCase() + member.categories[0].slice(1);
  }

  const handleBack = () => {
    // Real browser back returns to whichever our-people tab (all/designers/
    // managers/builders) the user came from. Only fall back to the plain
    // list when this page was the first one loaded in the session (e.g. a
    // direct/refreshed link) — window.history.length isn't reliable here,
    // since a freshly opened tab's own blank starting entry still counts.
    if (hasNavigatedWithinApp()) {
      router.back();
    } else {
      router.push(ROUTES.ourPeople);
    }
  };

  return (
    <div 
      id={`member-detail-${member.id}`}
      className="w-full px-4 sm:px-8 py-2 select-none flex flex-col flex-1 min-h-0 h-full overflow-y-auto lg:overflow-hidden justify-start space-y-4 lg:space-y-2"
    >
      <BreadcrumbButton
        label={`Back to ${breadcrumbLabel}`}
        onClick={handleBack}
        className={`fixed left-0 right-0 top-[var(--header-height,53px)] lg:static z-30 pb-2 lg:pb-1 pt-2 lg:pt-0 lg:mb-2 px-4 sm:px-8 lg:px-0 ${
          isDarkMode ? 'bg-vintage-charcoal lg:bg-transparent' : 'bg-bright-gray lg:bg-transparent'
        }`}
      />

      <div className="mt-10 lg:mt-0 grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-10 gap-6 lg:gap-8 xl:gap-8 2xl:gap-10 flex-none lg:flex-1 min-h-0 lg:overflow-hidden pb-4 lg:pb-1">
        
        {/* COLUMN 1: Portrait Container (40% on XL+) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-stretch h-auto lg:h-full min-h-0 lg:overflow-hidden">
          <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-full lg:flex-1 min-h-0 overflow-hidden bg-black/10 rounded-none group border border-space-sparkle/20 animate-slide-up">
            <ImageWithFade
              src={member.image}
              alt={member.name}
              fill
              sizes="(min-width: 1280px) 40vw, (min-width: 768px) 42vw, 100vw"
              priority
              className="object-cover transition-all duration-700 ease-in-out hover:scale-105"
            />
          </div>
        </div>

        {/* COLUMN 2: Person Name & Bio (30% on XL+, 7 cols on MD) */}
        <div className="lg:col-span-7 xl:col-span-3 flex flex-col h-auto lg:h-full min-h-0 lg:overflow-hidden py-0.5">
          {/* Static Name & Role on Tablet+ */}
          <div className="shrink-0 space-y-0.5 mb-3 lg:mb-4">
            <h1 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight">
              {member.name}
            </h1>

            <div>
              <span className={`text-caption sm:text-mini uppercase tracking-widest font-bold opacity-80 ${
                isDarkMode ? 'text-white/80' : 'text-space-sparkle'
              }`}>
                {member.role}
              </span>
            </div>
          </div>

          {/* Scrollable text and accordions wrapper */}
          <div className="flex flex-col flex-1 min-h-0 lg:overflow-y-auto no-scrollbar lg:pr-2 space-y-3">
            <div className="flex-none">
              <p className="text-caption sm:text-body leading-relaxed font-light opacity-90 whitespace-pre-line text-justify">
                {member.fullBio}
              </p>
            </div>

            {/* Accreditations / Credentials Block (Accordion for < XL screens) */}
            {member.affiliations && member.affiliations.length > 0 && (
              <Accordion key={`credentials-${member.id}`} title="Credentials" isDarkMode={isDarkMode} size="sm" className="shrink-0 xl:hidden">
                <div className="pb-2 pt-1 text-mini space-y-2 pl-[30px] pr-1">
                  <ul className="space-y-2">
                    {member.affiliations.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 font-light opacity-90">
                        <span className="text-space-sparkle font-semibold mt-0.5">•</span>
                        <div className="flex flex-col space-y-0.5">
                          <span className={`font-medium ${isDarkMode ? "text-bright-gray/90" : "text-vintage-charcoal/90"}`}>{item.title}</span>
                          <span className={`text-caption font-light opacity-75 leading-relaxed ${isDarkMode ? "text-bright-gray/70" : "text-vintage-charcoal/70"}`}>{item.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Accordion>
            )}

            {/* Dynamic Project Involvement Block (Accordion for < XL screens) */}
            {member.involvement && member.involvement.length > 0 && (
              <Accordion key={`involvement-${member.id}`} title="Project Involvement" isDarkMode={isDarkMode} size="sm" className="shrink-0 xl:hidden">
                <div className="pb-2 pt-1 text-mini space-y-2 pl-[30px] pr-1">
                  <ul className="space-y-1.5">
                    {member.involvement.map((inv) => {
                      const project = projects.find(p => p.id === inv.projectId);
                      return (
                        <li key={inv.projectId} className="flex items-start space-x-2 font-light opacity-90">
                          <span className="text-space-sparkle font-semibold mt-0.5">•</span>
                          {project ? (
                            <Link
                              href={projectRoute(project.id)}
                              className={`text-left hover:text-space-sparkle hover:underline transition-all focus:outline-none cursor-pointer flex items-center gap-1 font-medium ${
                                isDarkMode ? "text-bright-gray/90" : "text-vintage-charcoal/90"
                              }`}
                            >
                              <span>{inv.projectTitle}</span>
                              <ArrowUpRight size={12} className="opacity-65 text-space-sparkle" />
                            </Link>
                          ) : (
                            <span className={isDarkMode ? "text-bright-gray/90" : "text-vintage-charcoal/90"}>
                              {inv.projectTitle}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Accordion>
            )}
          </div>
        </div>

        {/* COLUMN 3: Credentials & Project Involvement (30% on XL+, hidden on < XL) */}
        <div className="hidden xl:flex xl:col-span-3 flex-col h-full min-h-0 overflow-hidden space-y-4 py-0.5">
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 no-scrollbar space-y-6">
            
            {/* Credentials Section */}
            {member.affiliations && member.affiliations.length > 0 && (
              <div className="space-y-3">
                <h2 className={`text-caption sm:text-mini uppercase tracking-widest font-bold opacity-80 ${
                  isDarkMode ? 'text-white/80' : 'text-space-sparkle'
                }`}>
                  Credentials
                </h2>
                <ul className="space-y-3">
                  {member.affiliations.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 font-light">
                      <span className="text-space-sparkle font-semibold mt-0.5 text-mini">•</span>
                      <div className="flex flex-col space-y-0.5">
                        <span className={`text-mini font-medium leading-snug ${
                          isDarkMode ? 'text-bright-gray' : 'text-vintage-charcoal'
                        }`}>
                          {item.title}
                        </span>
                        <p className={`text-caption leading-relaxed font-light ${
                          isDarkMode ? 'text-bright-gray/70' : 'text-vintage-charcoal/70'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Project Involvement Section */}
            {member.involvement && member.involvement.length > 0 && (
              <div className="space-y-3">
                <h2 className={`text-caption sm:text-mini uppercase tracking-widest font-bold opacity-80 ${
                  isDarkMode ? 'text-white/80' : 'text-space-sparkle'
                }`}>
                  Project Involvement
                </h2>
                <ul className="space-y-3">
                  {member.involvement.map((inv) => {
                    const project = projects.find(p => p.id === inv.projectId);
                    return (
                      <li key={inv.projectId} className="flex items-start space-x-2.5 font-light">
                        <span className="text-space-sparkle font-semibold mt-0.5 text-mini">•</span>
                        <div className="flex flex-col space-y-0.5 flex-1">
                          {project ? (
                            <Link
                              href={projectRoute(project.id)}
                              className={`group text-mini font-medium hover:text-space-sparkle transition-all focus:outline-none cursor-pointer inline-flex items-center gap-1.5 ${
                                isDarkMode ? 'text-bright-gray' : 'text-vintage-charcoal'
                              }`}
                            >
                              <span className="group-hover:underline underline-offset-2">{inv.projectTitle}</span>
                              <ArrowUpRight size={13} className="opacity-65 text-space-sparkle group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                          ) : (
                            <span className={`text-mini font-medium ${
                              isDarkMode ? 'text-bright-gray' : 'text-vintage-charcoal'
                            }`}>
                              {inv.projectTitle}
                            </span>
                          )}
                          {inv.roleInProject && (
                            <span className={`text-caption italic font-light ${
                              isDarkMode ? 'text-bright-gray/60' : 'text-vintage-charcoal/60'
                            }`}>
                              {inv.roleInProject}
                            </span>
                          )}
                          {inv.description && (
                            <p className={`text-caption leading-relaxed font-light mt-0.5 ${
                              isDarkMode ? 'text-bright-gray/70' : 'text-vintage-charcoal/70'
                            }`}>
                              {inv.description}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [member, setMember] = useState<Member | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(p => {
      const decodedSlug = decodeURIComponent(p.slug);
      Promise.all([getMemberById(decodedSlug), getProjects()]).then(([mem, projs]) => {
        setMember(mem || null);
        setProjects(projs);
        setIsLoading(false);
      });
    });
  }, [params]);


  if (isLoading || !member) return null;

  return (
    <Suspense fallback={null}>
      <MemberDetailContent member={member} projects={projects} />
    </Suspense>
  );
}
