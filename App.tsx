
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import { ProjectCard } from './components/ProjectCard';
import AIChat from './components/AIChat';
import { Mail, Linkedin, MapPin, Copy, Check, ExternalLink, Loader2, Rocket, AlertTriangle, UserCheck, Shield, Cpu } from 'lucide-react';
import { PortfolioProvider, usePortfolio } from './contexts/PortfolioContext';

const PortfolioContent: React.FC = () => {
  const { data, isLoading, error } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const storedTheme = window.localStorage.getItem('portfolio-theme');
    if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4 text-[var(--copper)]">
          <Loader2 size={48} className="animate-spin" />
          <p className="text-[var(--muted)] font-medium text-lg tracking-wide">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)] animate-in fade-in duration-1000 transition-colors">
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      <main>
        {error && (
          <div className="bg-[var(--copper)]/10 border-b border-[var(--copper)]/20 py-3 px-6 flex justify-center items-center gap-3 text-[var(--paper)] text-xs md:text-sm animate-in fade-in duration-500">
            <AlertTriangle size={16} className="text-[var(--copper)] shrink-0" />
            <span className="font-medium">Connectivity Notice: Serving static fallback. Secure remote details could not be reached.</span>
          </div>
        )}

        <Hero />

        {/* LinkedIn Embed / Profile Section */}
        <section className="py-20 px-6 bg-[var(--band)] border-y border-[var(--line)]">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <div className="relative z-10 grid lg:grid-cols-[1.4fr_0.8fr] items-stretch gap-10">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 rounded-md text-[var(--copper)] text-xs font-bold uppercase tracking-widest">
                    <UserCheck size={14} /> Professional Identity
                  </div>
                  <h2 className="text-3xl md:text-5xl font-fraunces font-bold text-[var(--paper)] tracking-tight max-w-3xl">
                    Systems architecture, test discipline, and applied AI in one engineering track.
                  </h2>
                  <p className="text-[var(--body-muted)] text-lg leading-relaxed max-w-3xl">
                    My background spans automotive validation, embedded software quality, MBSE-driven system design, and production LLM applications. LinkedIn carries the full career timeline; this site focuses on the engineering judgment behind the work.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <a
                      href={data.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[var(--paper)] hover:opacity-90 text-[var(--ink)] px-7 py-4 rounded-md font-bold transition-all"
                    >
                      <Linkedin size={20} /> View Career Timeline
                    </a>
                    <div className="flex items-center gap-2 text-[var(--subtle)] text-sm font-medium">
                      <Shield size={16} className="text-[var(--teal)]" />
                      <span>Automotive systems · Singapore</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--panel)] border border-[var(--line)] rounded-lg p-6 md:p-8">
                  <div className="flex items-start justify-between gap-6 border-b border-[var(--line)] pb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--subtle)] mb-2">Current Focus</p>
                      <h3 className="text-2xl font-fraunces font-bold text-[var(--paper)]">Secure access systems</h3>
                    </div>
                    <Linkedin className="text-[var(--copper)]" size={28} />
                  </div>
                  <div className="divide-y divide-[var(--line)]">
                    <div className="py-5">
                      <p className="text-sm text-[var(--subtle)]">Architecture</p>
                      <p className="text-[var(--paper)] font-medium">CCC/MFi/Google-aligned digital key flows</p>
                    </div>
                    <div className="py-5">
                      <p className="text-sm text-[var(--subtle)]">Connectivity</p>
                      <p className="text-[var(--paper)] font-medium">UWB, BLE, NFC, cloud backends</p>
                    </div>
                    <div className="py-5">
                      <p className="text-sm text-[var(--subtle)]">Applied AI</p>
                      <p className="text-[var(--paper)] font-medium">LLM tools for engineering workflows</p>
                    </div>
                    <a
                      href={data.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 pt-5 text-[var(--copper)] hover:text-[var(--paper)] text-sm font-bold transition-colors"
                    >
                      Open LinkedIn <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 px-6 bg-[var(--ink)] scroll-mt-28">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4 text-[var(--copper)]">
                  <Cpu size={24} />
                  <span className="font-mono text-sm tracking-widest uppercase">System Implementations</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-fraunces font-bold text-[var(--paper)] mb-6 tracking-tight">Selected Technical Work</h2>
                <p className="text-[var(--body-muted)] text-lg">
                  Production-minded explorations across AI tooling, evaluation safety, and secure automotive connectivity.
                </p>
              </div>
              <a
                href="https://github.com/SophiaSama"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--paper)] hover:text-[var(--copper)] font-medium transition-colors group px-6 py-3 bg-[var(--panel)] rounded-md border border-[var(--line)]"
              >
                Global Repositories <ExternalLink size={18} />
              </a>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-10">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <ProjectCard project={project} />
                </div>
              ))}

              <div className="group relative bg-[var(--panel)]/60 border border-[var(--line)] border-dashed rounded-lg flex flex-col items-center justify-center p-12 hover:border-[var(--copper)]/50 transition-all duration-500 min-h-[400px]">
                <div className="w-20 h-20 rounded-md bg-[var(--panel-soft)] border border-[var(--line)] flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform">
                  <Rocket size={38} className="text-[var(--copper)]" />
                </div>
                <h3 className="text-2xl font-fraunces font-bold text-[var(--paper)] mb-3 text-center">Next Frontier: UWB Security</h3>
                <p className="text-[var(--subtle)] text-center max-w-sm leading-relaxed">
                  Currently prototyping ultra-wideband (UWB) ranging security and multi-layered authentication for next-gen vehicle access.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Experience />

        <section id="contact" className="py-32 px-6 border-t border-[var(--line)] bg-[var(--band)] scroll-mt-28">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-fraunces font-bold text-[var(--paper)] mb-8 tracking-tight">Let’s Talk Systems</h2>
            <p className="text-[var(--body-muted)] mb-12 text-lg max-w-2xl mx-auto">
              I am open to discussions regarding System Architecture roles and automotive security research collaborations.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <div className="w-full sm:w-auto flex items-center justify-center bg-[var(--panel)] border border-[var(--line)] pl-6 pr-4 py-5 rounded-md hover:bg-[var(--panel-soft)] hover:border-[var(--copper)]/50 transition-all group relative">
                <a href={`mailto:${data.email}`} className="flex items-center gap-3 mr-3 hover:opacity-80 transition-opacity">
                  <Mail className="text-[var(--copper)] group-hover:scale-110 transition-transform" />
                  <span className="text-[var(--paper)] font-medium">{data.email}</span>
                </a>
                <div className="w-px h-6 bg-[var(--line)] mx-1"></div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 ml-1 text-[var(--muted)] hover:text-[var(--paper)] hover:bg-[var(--panel-hover)] rounded-md transition-all relative"
                >
                  {copied ? <Check size={18} className="text-[var(--teal)]" /> : <Copy size={18} />}
                </button>
              </div>

              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[var(--panel)] border border-[var(--line)] px-8 py-5 rounded-md hover:bg-[var(--panel-soft)] hover:border-[var(--copper)]/50 transition-all group"
              >
                <Linkedin className="text-[var(--copper)] group-hover:scale-110 transition-transform" />
                <span className="text-[var(--paper)] font-medium">LinkedIn Network</span>
              </a>
            </div>

            <div className="mt-20 flex flex-col items-center gap-4 text-[var(--faint)]">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin size={16} className="text-[var(--subtle)]" />
                <span>{data.location}</span>
              </div>
              <footer className="text-[var(--faint)] text-xs mt-4">
                <p>&copy; {new Date().getFullYear()} Ruiping Wang. System Architect Portfolio.</p>
              </footer>
            </div>
          </div>
        </section>
      </main>

      <AIChat />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
