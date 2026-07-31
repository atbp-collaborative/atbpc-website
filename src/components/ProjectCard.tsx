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
      id={`project-card-${project.id}`}
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden rounded-none border transition-all hover:shadow-2xl duration-500 relative aspect-square w-full md:w-[calc(50%-25px)] lg:w-[calc(33.333%-34px)] lg:max-w-[380px] ${
        isDarkMode ? 'border-space-sparkle/15 bg-vintage-charcoal/40' : 'border-space-sparkle/10 bg-white'
      }`}
    >
      {/* Project Thumbnail Image occupying whole card */}
      <img 
        src={project.images[0]} 
        alt={project.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      
      {/* Dark Overlay (60% transparency) appearing on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 z-10">
        {/* Contents sliding up from below on hover */}
        <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out space-y-3">
          <div className="text-caption uppercase tracking-widest text-white/80 font-sans flex items-center gap-1.5">
            <span>{project.year}</span>
            <span className="opacity-60">.</span>
            <span>{project.category}</span>
          </div>
          
          <h3 className="font-sans text-h2 font-semibold tracking-tight text-white leading-tight">
            {project.title}
          </h3>
          
          <p className="text-caption font-light text-white/90 leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
};
