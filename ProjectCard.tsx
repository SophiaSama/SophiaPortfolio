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
    <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-transparent transition-colors z-10" />
        
        {hasError ? (
           <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800">
             <ImageOff size={32} className="mb-2" />
             <span className="text-xs">Image unavailable</span>
           </div>
        ) : (
          <img 
            src={imgSrc} 
            alt={project.title} 
            onError={handleError}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>
          <div className="flex gap-2">
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
              title="View Source"
            >
              <Github size={20} />
            </a>
            {project.demoUrl && (
              <a 
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
                title="Live Demo"
              >
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>

        <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
          {project.description}
        </p>

        {/* Feature Highlights */}
        <div className="mb-6 space-y-2">
           <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
             <Terminal size={12} /> Key Features
           </h4>
           <ul className="text-sm text-slate-300 space-y-1 ml-1">
             {project.features.slice(0, 3).map((feat, idx) => (
               <li key={idx} className="flex items-center gap-2">
                 <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
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
              className="px-3 py-1 text-xs font-medium bg-slate-800 text-indigo-300 rounded-full border border-slate-700 transition-all duration-300 hover:scale-110 hover:bg-indigo-900 hover:text-indigo-200 hover:border-indigo-700 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};