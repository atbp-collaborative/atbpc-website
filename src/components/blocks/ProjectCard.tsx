import React from 'react';
import { Project } from '@/types';
import { ImageWithFade } from '@/components/primitives/ImageWithFade';

export interface ProjectCardProps {
  project: Project;
  totalProjects: number;
  isDarkMode: boolean;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, totalProjects, isDarkMode, onClick }) => {
  const isFewProjects = totalProjects <= 2;

  return (
    <div
      onClick={onClick}
      className={`group relative flex-shrink-0 w-full md:w-[calc(100%/var(--max-items-tablet))] lg:w-[calc(100%/var(--max-items-desktop))] aspect-[3/2] ${isFewProjects ? '3xl:aspect-[4/3]' : '3xl:aspect-[9/16]'} 3xl:max-h-[85vh] overflow-hidden rounded-none border transition-all duration-500 cursor-pointer select-none ${
        isDarkMode ? 'border-space-sparkle/20 bg-vintage-charcoal/40 hover:border-white/40' : 'border-space-sparkle/15 bg-white hover:border-space-sparkle/40'
      }`}
    >
      <ImageWithFade
        src={project.images[0]}
        alt={project.title}
        fill
        sizes="(min-width: 1024px) 410px, (min-width: 768px) 370px, 100vw"
        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 sm:p-5 z-10 text-left">
        <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out space-y-1 text-left">
          <h3 className="font-sans text-body sm:text-h2 font-semibold text-white tracking-wide leading-tight text-left">
            {project.title}
          </h3>

          <span className="text-caption font-sans text-white/75 block text-left">
            {project.location}
          </span>
        </div>
      </div>
    </div>
  );
};
