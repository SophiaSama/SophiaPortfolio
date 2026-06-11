import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

  return (
    <article className="group flex flex-col md:flex-row gap-6 border-b border-[var(--paper)] pb-12 hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-colors p-6 -mx-6 h-full">
      <div className="md:w-1/3 flex flex-col justify-between">
        <div>
          <h3 className="text-3xl md:text-4xl font-fraunces font-black uppercase tracking-tight leading-none mb-4 group-hover:text-[var(--ink)] transition-colors">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-[var(--paper)] group-hover:border-[var(--ink)] group-hover:text-[var(--ink)] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-auto">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:opacity-50 transition-opacity"
            title="View Source"
          >
            <Github size={16} /> Source
          </a>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:opacity-50 transition-opacity"
              title="Live Demo"
            >
              <ExternalLink size={16} /> Live
            </a>
          )}
        </div>
      </div>

      <div className="md:w-2/3 flex flex-col justify-between pl-0 md:pl-8 border-l-0 md:border-l border-[var(--paper)] group-hover:border-[var(--ink)] transition-colors">
        <p className="text-lg md:text-xl font-light leading-relaxed mb-8">
          {project.description}
        </p>

        <ul className="space-y-4">
          {project.features.map((feat, idx) => (
            <li key={idx} className="flex gap-4 items-start text-sm md:text-base font-medium">
              <span className="font-mono text-xs mt-1 opacity-50">{(idx + 1).toString().padStart(2, '0')}</span>
              <span className="leading-tight">{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};
