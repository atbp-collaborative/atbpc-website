'use client';

import React from 'react';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Member, Project } from '../types';
import { useTheme } from '../lib/theme-context';
import { ROUTES, projectRoute } from '../lib/routes';
import { Accordion } from './Accordion';

interface MemberDetailProps {
  member: Member;
  projects: Project[];
}

export const MemberDetail: React.FC<MemberDetailProps> = ({
  member,
  projects,
}) => {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <motion.div 
      id={`member-detail-${member.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-12 animate-fade-in"
    >
      {/* Breadcrumb & Close */}
      <div className="flex items-center justify-start gap-4 mb-8">
        <button
          onClick={() => router.push(ROUTES.ourPeople)}
          className="flex items-center space-x-2 text-caption uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Back to structure</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Portrait Container */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/10 rounded-none group border border-space-sparkle/20 animate-slide-up">
            <img 
              src={member.image} 
              alt={member.name}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* RIGHT: High-End Bio & Project Involvement */}
        <div className="lg:col-span-7 space-y-8 flex flex-col justify-start">
          <div>
            <h1 className="font-sans text-hero font-bold tracking-tight">
              {member.name}
            </h1>

            <div className="mt-2">
              <span className={`text-mini uppercase tracking-widest font-bold opacity-80 ${
                isDarkMode ? 'text-white/80' : 'text-space-sparkle'
              }`}>
                {member.role}
              </span>
            </div>

            {member.license && (
              <div className="flex items-center space-x-2 mt-1 text-caption font-sans opacity-60">
                <span>{member.license}</span>
              </div>
            )}

            <p className="text-body leading-relaxed font-light opacity-90 whitespace-pre-line text-justify mt-6">
              {member.fullBio}
            </p>
          </div>

          {/* Accreditations / Credentials Block */}
          <Accordion key={`credentials-${member.id}`} title="Credentials" isDarkMode={isDarkMode}>
            <div className="pb-4 pt-1 text-caption space-y-4 pl-[30px]">
              <ul className="space-y-2">
                {member.education.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 font-light opacity-90">
                    <span className="text-space-sparkle font-semibold mt-0.5">•</span>
                    <span className={isDarkMode ? "text-bright-gray/90" : "text-slate-700"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Accordion>

          {/* Dynamic Project Involvement Block */}
          <Accordion key={`involvement-${member.id}`} title="Project Involvement" isDarkMode={isDarkMode}>
            <div className="pb-4 pt-1 text-caption space-y-4 pl-[30px]">
              <ul className="space-y-2">
                {member.involvement.map((inv) => {
                  const project = projects.find(p => p.id === inv.projectId);
                  return (
                    <li key={inv.projectId} className="flex items-start space-x-2 font-light opacity-90">
                      <span className="text-space-sparkle font-semibold mt-0.5">•</span>
                      {project ? (
                        <button
                          onClick={() => router.push(projectRoute(project.id))}
                          className={`text-left hover:text-space-sparkle hover:underline transition-all focus:outline-none cursor-pointer flex items-center gap-1 font-medium ${
                            isDarkMode ? "text-bright-gray/90" : "text-slate-700"
                          }`}
                        >
                          <span>{inv.projectTitle}</span>
                          <ArrowUpRight size={12} className="opacity-65 text-space-sparkle" />
                        </button>
                      ) : (
                        <span className={isDarkMode ? "text-bright-gray/90" : "text-slate-700"}>
                          {inv.projectTitle}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Accordion>

        </div>
      </div>
    </motion.div>
  );
};
