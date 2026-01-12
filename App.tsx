
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import { ProjectCard } from './components/ProjectCard';
import AIChat from './components/AIChat';
import SecurityCheck from './components/SecurityCheck';
import { Mail, Linkedin, MapPin, Copy, Check, ExternalLink, Loader2, Rocket, AlertTriangle, UserCheck, Shield, Cpu } from 'lucide-react';
import { PortfolioProvider, usePortfolio } from './contexts/PortfolioContext';

const PortfolioContent: React.FC = () => {
  const { data, isLoading, error } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVerified) {
    return <SecurityCheck onVerify={() => setIsVerified(true)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-indigo-400">
          <Loader2 size={48} className="animate-spin" />
          <p className="text-slate-400 font-medium text-lg tracking-wide">Secure Connection Established. Fetching data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 animate-in fade-in duration-1000">
      <Header />
      
      <main>
        {error && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 px-6 flex justify-center items-center gap-3 text-amber-200 text-xs md:text-sm animate-in fade-in duration-500">
            <AlertTriangle size={16} className="text-amber-500 shrink-0" />
            <span className="font-medium">Connectivity Notice: Serving static fallback. Secure remote details could not be reached.</span>
          </div>
        )}

        <Hero />

        {/* LinkedIn Embed / Profile Section */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Linkedin size={200} />
              </div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                    <UserCheck size={14} /> Professional Identity
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Verified Professional Profile
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                    I maintain an active professional presence on LinkedIn. Connect with me to view my full career trajectory, endorsements, educational background, and professional network within the automotive systems ecosystem.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <a 
                      href={data.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-indigo-600/20"
                    >
                      <Linkedin size={20} /> View Full Career History
                    </a>
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Shield size={16} className="text-green-500" />
                      <span>Verified Industry Professional</span>
                    </div>
                  </div>
                </div>

                {/* Simulated LinkedIn Profile Card */}
                <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
                  <div className="px-6 pb-8 -mt-12 text-center">
                    <div className="inline-block p-1 bg-slate-950 rounded-full mb-4">
                       <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-950 flex items-center justify-center text-slate-500 overflow-hidden">
                          <Linkedin size={48} className="opacity-20" />
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">Ruiping Wang</h3>
                    <p className="text-slate-400 text-sm mt-1 mb-4">System Architect | Automotive Security | Connectivity Expert</p>
                    <div className="flex justify-center gap-2 mb-6">
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Singapore</span>
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">NTU Alumna</span>
                    </div>
                    <a 
                      href={data.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-full text-sm font-bold transition-colors"
                    >
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 px-6 bg-slate-900/30 scroll-mt-28">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4 text-indigo-400">
                  <Cpu size={24} />
                  <span className="font-mono text-sm tracking-widest uppercase">System Implementations</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Technical Showcases</h2>
                <p className="text-slate-400 text-lg">
                  Specialized engineering explorations in secure automotive connectivity and digital key protocols.
                </p>
              </div>
              <a 
                href="https://github.com/SophiaSama" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors group px-6 py-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20"
              >
                Global Repositories <ExternalLink size={18} />
              </a>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-10">
              {data.projects.map((project) => (
                <div key={project.id} className={project.id === 'carkeydemo' ? 'lg:col-span-1 shadow-2xl shadow-indigo-500/5' : ''}>
                  <ProjectCard project={project} />
                </div>
              ))}
              
              <div className="group relative bg-slate-900/20 border border-slate-800 border-dashed rounded-3xl flex flex-col items-center justify-center p-12 hover:border-slate-700 transition-all duration-500 min-h-[400px]">
                <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <Rocket size={40} className="text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-3 text-center">Next Frontier: UWB Security</h3>
                <p className="text-slate-500 text-center max-w-sm leading-relaxed">
                  Currently prototyping ultra-wideband (UWB) ranging security and multi-layered authentication for next-gen vehicle access.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-32 px-6 border-t border-slate-900 bg-slate-950 scroll-mt-28">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">Let's Interface</h2>
            <p className="text-slate-400 mb-12 text-lg max-w-2xl mx-auto">
              I am open to discussions regarding System Architecture roles and automotive security research collaborations.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <div className="w-full sm:w-auto flex items-center justify-center bg-slate-900 border border-slate-800 pl-6 pr-4 py-5 rounded-2xl hover:bg-slate-800 hover:border-indigo-500/50 transition-all group relative">
                <a href={`mailto:${data.email}`} className="flex items-center gap-3 mr-3 hover:opacity-80 transition-opacity">
                  <Mail className="text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-200 font-medium">{data.email}</span>
                </a>
                <div className="w-px h-6 bg-slate-700 mx-1"></div>
                <button 
                  onClick={handleCopyEmail}
                  className="p-2 ml-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all relative"
                >
                  {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>
              </div>

              <a 
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 px-8 py-5 rounded-2xl hover:bg-slate-800 hover:border-indigo-500/50 transition-all group"
              >
                <Linkedin className="text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-slate-200 font-medium">LinkedIn Network</span>
              </a>
            </div>

            <div className="mt-20 flex flex-col items-center gap-4 text-slate-600">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin size={16} className="text-slate-500" />
                <span>{data.location}</span>
              </div>
              <footer className="text-slate-700 text-xs mt-4">
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
