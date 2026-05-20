import React, { useState } from 'react';
import { ExternalLink, Github, Terminal, ImageOff } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [imgSrc, setImgSrc] = useState(project.imageUrl);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to a generic abstract tech pattern if image fails
      setImgSrc('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop');
    }
  };

  return (
    <div className="group relative bg-[var(--panel)] border border-[var(--line)] rounded-lg overflow-hidden hover:border-[var(--copper)]/60 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-[var(--panel-soft)]">
        <div className="absolute inset-0 bg-[var(--ink)]/35 group-hover:bg-[var(--ink)]/10 transition-colors z-10" />
        <div className="absolute left-4 top-4 z-20 text-[10px] uppercase tracking-[0.22em] text-[var(--paper)] bg-[var(--ink)]/75 border border-[var(--line)] px-2 py-1 rounded-sm">
          {project.id}
        </div>
        
        {hasError ? (
           <div className="w-full h-full flex flex-col items-center justify-center text-[var(--subtle)] bg-[var(--panel-soft)]">
             <ImageOff size={32} className="mb-2" />
             <span className="text-xs">Image unavailable</span>
           </div>
        ) : (
          <img 
            src={imgSrc} 
            alt={project.title} 
            onError={handleError}
            className="w-full h-full object-cover grayscale-[20%] contrast-110 transform group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-fraunces font-bold text-[var(--paper)] group-hover:text-[var(--copper)] transition-colors">
            {project.title}
          </h3>
          <div className="flex gap-2">
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-[var(--muted)] hover:text-[var(--paper)] hover:bg-[var(--panel-soft)] rounded-md transition-all"
              title="View Source"
            >
              <Github size={20} />
            </a>
            {project.demoUrl && (
              <a 
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[var(--muted)] hover:text-[var(--paper)] hover:bg-[var(--panel-soft)] rounded-md transition-all"
                title="Live Demo"
              >
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>

        <p className="text-[var(--body-muted)] mb-6 text-sm leading-relaxed flex-grow">
          {project.description}
        </p>

        {/* Feature Highlights */}
        <div className="mb-6 space-y-2">
           <h4 className="text-xs font-semibold text-[var(--subtle)] uppercase tracking-wider flex items-center gap-1">
             <Terminal size={12} /> Key Features
           </h4>
           <ul className="text-sm text-[var(--body)] space-y-1 ml-1">
             {project.features.slice(0, 3).map((feat, idx) => (
               <li key={idx} className="flex items-center gap-2">
                 <span className="w-1 h-1 bg-[var(--copper)] rounded-full"></span>
                 {feat}
               </li>
             ))}
           </ul>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map(tag => (
            <span 
              key={tag} 
              className="px-3 py-1 text-xs font-medium bg-[var(--panel-soft)] text-[var(--body)] rounded-sm border border-[var(--line)] transition-all duration-300 hover:border-[var(--copper)]/60 hover:text-[var(--paper)] cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
