'use client';

import React, { Suspense } from 'react';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Member, Project } from '../types';
import { useTheme } from '../lib/theme-context';
import { ROUTES, projectRoute } from '../lib/routes';
import { hasNavigatedWithinApp } from '../lib/navHistory';
import { Accordion } from './Accordion';

import { BreadcrumbButton } from './BreadcrumbButton';
import { ImageWithFade } from './ImageWithFade';

interface MemberDetailProps {
  member: Member;
  projects: Project[];
}

function MemberDetailContent({ member, projects }: MemberDetailProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();

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
    <motion.div 
      id={`member-detail-${member.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 sm:px-8 py-2 select-none flex flex-col flex-1 min-h-0 h-full overflow-hidden justify-between space-y-2"
    >
      <BreadcrumbButton
        label="Our People"
        onClick={handleBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 flex-1 min-h-0 overflow-hidden pb-1">
        
        {/* LEFT: Portrait Container */}
        <div className="lg:col-span-5 flex flex-col items-stretch h-full min-h-0 overflow-hidden">
          <div className="relative w-full h-[240px] sm:h-[320px] lg:h-full lg:flex-1 min-h-0 overflow-hidden bg-black/10 rounded-none group border border-space-sparkle/20 animate-slide-up">
            <ImageWithFade
              src={member.image}
              alt={member.name}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              priority
              className="object-cover transition-all duration-700 ease-in-out hover:scale-105"
            />
          </div>
        </div>

        {/* RIGHT: High-End Bio & Project Involvement */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-0 overflow-hidden space-y-2 py-0.5">
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden space-y-2">
            <div className="shrink-0 space-y-0.5">
              <h1 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight">
                {member.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span className={`text-caption sm:text-mini uppercase tracking-widest font-bold opacity-80 ${
                  isDarkMode ? 'text-white/80' : 'text-space-sparkle'
                }`}>
                  {member.role}
                </span>

                {member.license && (
                  <span className="text-caption font-sans opacity-60">
                    • {member.license}
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable text if bio is long */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 no-scrollbar">
              <p className="text-caption sm:text-body leading-relaxed font-light opacity-90 whitespace-pre-line text-justify">
                {member.fullBio}
              </p>
            </div>

            {/* Accreditations / Credentials Block */}
            {member.education && member.education.length > 0 && (
              <Accordion key={`credentials-${member.id}`} title="Credentials" isDarkMode={isDarkMode} size="sm" className="shrink-0">
                <div className="pb-2 pt-1 text-mini space-y-2 pl-[30px] max-h-[120px] overflow-y-auto">
                  <ul className="space-y-1">
                    {member.education.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 font-light opacity-90">
                        <span className="text-space-sparkle font-semibold mt-0.5">•</span>
                        <span className={isDarkMode ? "text-bright-gray/90" : "text-vintage-charcoal/90"}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Accordion>
            )}

            {/* Dynamic Project Involvement Block */}
            {member.involvement && member.involvement.length > 0 && (
              <Accordion key={`involvement-${member.id}`} title="Project Involvement" isDarkMode={isDarkMode} size="sm" className="shrink-0">
                <div className="pb-2 pt-1 text-mini space-y-2 pl-[30px] max-h-[120px] overflow-y-auto">
                  <ul className="space-y-1">
                    {member.involvement.map((inv) => {
                      const project = projects.find(p => p.id === inv.projectId);
                      return (
                        <li key={inv.projectId} className="flex items-start space-x-2 font-light opacity-90">
                          <span className="text-space-sparkle font-semibold mt-0.5">•</span>
                          {project ? (
                            <button
                              onClick={() => router.push(projectRoute(project.id))}
                              className={`text-left hover:text-space-sparkle hover:underline transition-all focus:outline-none cursor-pointer flex items-center gap-1 font-medium ${
                                isDarkMode ? "text-bright-gray/90" : "text-vintage-charcoal/90"
                              }`}
                            >
                              <span>{inv.projectTitle}</span>
                              <ArrowUpRight size={12} className="opacity-65 text-space-sparkle" />
                            </button>
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
      </div>
    </motion.div>
  );
}

export const MemberDetail: React.FC<MemberDetailProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <MemberDetailContent {...props} />
    </Suspense>
  );
};
