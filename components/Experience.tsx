import React from 'react';
import { Briefcase, Calendar, GraduationCap } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

const Experience: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="experience" className="py-24 px-6 bg-[var(--ink)] scroll-mt-28 relative overflow-hidden border-b border-[var(--line)]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <div className="text-[var(--copper)] text-xs uppercase tracking-[0.24em] font-bold mb-4">Career Trace</div>
          <h2 className="text-3xl md:text-5xl font-fraunces font-bold text-[var(--paper)] mb-4">Professional Journey</h2>
          <p className="text-[var(--body-muted)] max-w-2xl">
            From test engineering to systems architecture, a decade of experience in automotive innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-12">
          
          {/* Work Experience Column */}
          <div className="space-y-12">
            <h3 className="text-2xl font-fraunces font-bold text-[var(--paper)] flex items-center gap-3 mb-8">
              <Briefcase className="text-[var(--copper)]" />
              Work Experience
            </h3>
            
            <div className="relative border-l border-[var(--line)] ml-3 space-y-12">
              {data.workExperience.map((job, index) => (
                <div key={index} className="relative pl-8 md:pl-12 group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[var(--ink)] border border-[var(--copper)] group-hover:bg-[var(--copper)] group-hover:scale-125 transition-all duration-300" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <h4 className="text-xl font-bold text-[var(--paper)]">{job.role}</h4>
                    <span className="hidden sm:inline text-[var(--ghost)]">•</span>
                    <span className="text-[var(--copper)] font-medium">{job.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-[var(--subtle)] mb-4 font-mono">
                    <Calendar size={14} />
                    {job.period}
                  </div>
                  
                  <p className="text-[var(--body-muted)] leading-relaxed mb-4 text-sm md:text-base">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.tech.split(', ').map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-[var(--panel)] border border-[var(--line)] rounded-sm text-xs text-[var(--muted)] font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div className="space-y-12">
            <div className="sticky top-32 space-y-12">
              <div>
                <h3 className="text-2xl font-fraunces font-bold text-[var(--paper)] flex items-center gap-3 mb-8">
                  <GraduationCap className="text-[var(--copper)]" />
                  Education
                </h3>

                <div className="space-y-6">
                  {data.education.map((edu, index) => (
                    <div key={index} className="bg-[var(--panel)] border border-[var(--line)] p-6 rounded-lg hover:border-[var(--copper)]/50 transition-colors">
                      <div className="text-[var(--copper)] font-bold mb-1">{edu.degree}</div>
                      <div className="text-[var(--paper)] font-medium mb-1">{edu.school}</div>
                      <div className="text-xs text-[var(--subtle)] mb-2 font-mono">{edu.year}</div>
                      {edu.details && (
                        <p className="text-xs text-[var(--body-muted)] italic">{edu.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Experience;
