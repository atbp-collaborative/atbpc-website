import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  isDarkMode: boolean;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isDarkMode, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex-shrink-0 w-[270px] sm:w-[330px] md:w-[370px] lg:w-[410px] h-full overflow-hidden rounded-none border transition-all duration-500 cursor-pointer snap-start select-none ${
        isDarkMode ? 'border-space-sparkle/20 bg-vintage-charcoal/40 hover:border-white/40' : 'border-space-sparkle/15 bg-white hover:border-space-sparkle/40'
      }`}
    >
      <img
        src={project.images[0]}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        referrerPolicy="no-referrer"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 sm:p-5 z-10 text-left">
        <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out space-y-1 text-left">
          <h3 className="font-sans text-h3 sm:text-h2 font-semibold text-white tracking-wide leading-tight text-left">
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
