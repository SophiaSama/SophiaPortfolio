import React from 'react';
import { Briefcase, Calendar, GraduationCap } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

const Experience: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="experience" className="py-24 px-6 bg-slate-950 scroll-mt-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Professional Journey</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From test engineering to systems architecture, a decade of experience in automotive innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-12">
          
          {/* Work Experience Column */}
          <div className="space-y-12">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
              <Briefcase className="text-indigo-400" />
              Work Experience
            </h3>
            
            <div className="relative border-l-2 border-slate-800 ml-3 space-y-12">
              {data.workExperience.map((job, index) => (
                <div key={index} className="relative pl-8 md:pl-12 group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:bg-indigo-500 group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <h4 className="text-xl font-bold text-slate-100">{job.role}</h4>
                    <span className="hidden sm:inline text-slate-600">•</span>
                    <span className="text-indigo-400 font-medium">{job.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-mono">
                    <Calendar size={14} />
                    {job.period}
                  </div>
                  
                  <p className="text-slate-400 leading-relaxed mb-4 text-sm md:text-base">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.tech.split(', ').map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
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
                <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
                  <GraduationCap className="text-indigo-400" />
                  Education
                </h3>

                <div className="space-y-6">
                  {data.education.map((edu, index) => (
                    <div key={index} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/30 transition-colors">
                      <div className="text-indigo-400 font-bold mb-1">{edu.degree}</div>
                      <div className="text-slate-300 font-medium mb-1">{edu.school}</div>
                      <div className="text-xs text-slate-500 mb-2 font-mono">{edu.year}</div>
                      {edu.details && (
                        <p className="text-xs text-slate-400 italic">{edu.details}</p>
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
