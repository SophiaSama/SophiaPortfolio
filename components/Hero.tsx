import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

const Hero: React.FC = () => {
  const { data } = usePortfolio();

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-indigo-400 text-xs font-medium uppercase tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            System Architect
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
            {data.heroTitle.split(',')[0]},
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              {data.heroTitle.split(',')[1] || "Secure Automotive Design"}
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            {data.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#projects"
              onClick={scrollToSection('projects')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              View Projects <ArrowRight size={20} />
            </a>
            <a 
              href="#contact"
              onClick={scrollToSection('contact')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Get In Touch
            </a>
          </div>
        </div>

        {/* Visual Element */}
        <div className="relative hidden md:block">
            <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-3 font-mono text-sm">
                    <div className="flex gap-2">
                        <span className="text-pink-500">const</span>
                        <span className="text-blue-400">architect</span>
                        <span className="text-slate-400">=</span>
                        <span className="text-yellow-300">{`{`}</span>
                    </div>
                    <div className="pl-6 flex gap-2">
                        <span className="text-indigo-400">name:</span>
                        <span className="text-green-400">"Ruiping Wang"</span>,
                    </div>
                    <div className="pl-6 flex gap-2">
                        <span className="text-indigo-400">expertise:</span>
                        <span className="text-yellow-300">['MBSE', 'Automotive', 'UWB']</span>,
                    </div>
                    <div className="pl-6 flex gap-2">
                        <span className="text-indigo-400">certification:</span>
                        <span className="text-green-400">"ISTQB CTFL"</span>
                    </div>
                    <div className="text-yellow-300">{`}`}</div>
                </div>
            </div>
            {/* Decorative background blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl blur-3xl opacity-20 -z-10 transform translate-y-4 scale-95" />
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
        <ChevronDown size={24} />
      </div>
    </section>
  );
};

export default Hero;
