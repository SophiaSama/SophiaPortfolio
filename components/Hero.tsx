import React from 'react';
import { ArrowRight, ChevronDown, MapPin, ShieldCheck } from 'lucide-react';
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
    <section className="relative min-h-[92vh] flex items-center pt-24 overflow-hidden bg-[var(--ink)] border-b border-[var(--line)]">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--copper)]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Text Content */}
        <div className="space-y-9">
          <div className="inline-flex items-center gap-3 border-y border-[var(--line)] py-2 text-[var(--muted)] text-xs font-semibold tracking-[0.24em] uppercase">
            <ShieldCheck size={15} className="text-[var(--teal)]" />
            Automotive Connectivity · AI Systems
          </div>

          <h1 className="text-5xl md:text-7xl font-black font-fraunces leading-[0.98] text-[var(--paper)] tracking-tight">
            {data.heroTitle.split(',')[0]}
            <span className="block text-[var(--copper)] mt-3">
              for secure connected products.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--body-muted)] max-w-xl leading-relaxed font-light">
            {data.heroSubtitle}
          </p>

          <div className="grid grid-cols-3 max-w-xl border-y border-[var(--line)] divide-x divide-[var(--line)]">
            <div className="py-4 pr-4">
              <div className="text-2xl font-fraunces font-bold text-[var(--paper)]">13+</div>
              <div className="text-xs uppercase tracking-widest text-[var(--subtle)]">Years</div>
            </div>
            <div className="py-4 px-4">
              <div className="text-2xl font-fraunces font-bold text-[var(--paper)]">UWB</div>
              <div className="text-xs uppercase tracking-widest text-[var(--subtle)]">BLE · NFC</div>
            </div>
            <div className="py-4 pl-4">
              <div className="text-2xl font-fraunces font-bold text-[var(--paper)]">LLM</div>
              <div className="text-xs uppercase tracking-widest text-[var(--subtle)]">Apps</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 pt-2">
            <a
              href="#projects"
              onClick={scrollToSection('projects')}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[var(--paper)] text-[var(--ink)] font-semibold rounded-md hover:opacity-90 transition-all active:scale-[0.98] cursor-pointer"
            >
              View Projects <ArrowRight size={18} className="translate-y-[1px]" />
            </a>
            <a
              href="#contact"
              onClick={scrollToSection('contact')}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[var(--panel)] hover:bg-[var(--panel-soft)] text-[var(--paper)] font-medium rounded-md border border-[var(--line)] transition-all active:scale-[0.98] cursor-pointer"
            >
              Get In Touch
            </a>
          </div>
        </div>

        {/* Visual Element */}
        <div className="relative hidden md:block group">
          <div className="relative z-10 bg-[var(--panel)] border border-[var(--line)] rounded-lg p-10 shadow-[0_30px_70px_rgba(0,0,0,0.45)] overflow-hidden">

            {/* Subtle inner grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--panel-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--panel-grid)_1px,transparent_1px)] bg-[size:24px_24px] opacity-70 pointer-events-none" />

            <svg viewBox="0 0 400 300" className="w-full h-auto drop-shadow-2xl relative z-10">
              <defs>
                <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--teal)" />
                  <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.65" />
                </linearGradient>
                <linearGradient id="hsmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--copper)" />
                  <stop offset="100%" stopColor="var(--copper)" stopOpacity="0.72" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--copper)" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connection Lines */}
              <path d="M 200 60 L 200 120" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" fill="none" className="opacity-70 animate-[pulse_3s_ease-in-out_infinite]" />
              <path d="M 120 150 L 280 150" stroke="var(--paper)" strokeOpacity="0.16" strokeWidth="2" fill="none" />
              <path d="M 200 180 L 200 240" stroke="var(--copper)" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="4 4" fill="none" className="animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '1000ms' }} />
              <path d="M 120 200 L 120 230 A 10 10 0 0 0 130 240 L 160 240" stroke="var(--teal)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

              {/* Cloud Gateway */}
              <g transform="translate(140, 20)">
                <rect width="120" height="40" rx="12" fill="url(#cloudGrad)" opacity="0.1" />
                <rect width="120" height="40" rx="12" fill="none" stroke="url(#cloudGrad)" strokeOpacity="0.3" strokeWidth="1" />
                <path d="M 40 25 Q 40 15 50 15 Q 55 5 70 5 Q 85 5 90 15 Q 100 15 100 25 Z" fill="url(#cloudGrad)" opacity="0.9" />
                <text x="60" y="22" fill="var(--paper)" fontSize="11" fontWeight="600" textAnchor="middle" letterSpacing="0.5">CLOUD</text>
              </g>

              {/* Digital Base */}
              <rect x="80" y="120" width="240" height="60" rx="16" fill="var(--ink)" fillOpacity="0.45" stroke="var(--paper)" strokeOpacity="0.12" strokeWidth="1" />

              {/* Digital Key ECU */}
              <g transform="translate(100, 130)">
                <rect width="90" height="40" rx="8" fill="var(--teal)" opacity="0.12" />
                <rect width="90" height="40" rx="8" fill="none" stroke="var(--teal)" strokeOpacity="0.45" strokeWidth="1" />
                <circle cx="20" cy="20" r="4" fill="var(--teal)" filter="url(#glow)" className="animate-[pulse_2s_ease-in-out_infinite]" />
                <text x="35" y="24" fill="var(--paper)" fontSize="10" fontWeight="600" letterSpacing="0.5">DigiKey</text>
              </g>

              {/* Central ECU */}
              <g transform="translate(210, 130)">
                <rect width="90" height="40" rx="8" fill="var(--paper)" opacity="0.06" />
                <rect width="90" height="40" rx="8" fill="none" stroke="var(--paper)" strokeOpacity="0.16" strokeWidth="1" />
                <text x="45" y="24" fill="var(--paper)" fontSize="10" fontWeight="500" textAnchor="middle" letterSpacing="0.5">Zonal ECU</text>
              </g>

              {/* Embedded HSM */}
              <g transform="translate(160, 240)">
                <rect width="80" height="40" rx="10" fill="url(#hsmGrad)" opacity="0.9" />
                <path d="M 60 20 L 70 10 L 70 30 Z" fill="var(--ink)" opacity="0.18" />
                <circle cx="20" cy="20" r="10" fill="var(--ink)" opacity="0.14" />
                <path d="M 17 18 L 17 22 M 23 18 L 23 22 M 15 20 L 25 20 M 20 15 L 20 25" stroke="var(--ink)" strokeWidth="1" opacity="0.8" />
                <text x="45" y="24" fill="var(--ink)" fontSize="11" fontWeight="700" letterSpacing="0.5">HSM</text>
              </g>

              {/* Particles */}
              <circle cx="200" cy="90" r="2.5" fill="var(--teal)" filter="url(#glow)">
                <animate attributeName="cy" values="60;120;60" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="210" r="2.5" fill="var(--copper)" filter="url(#glow)">
                <animate attributeName="cy" values="180;240;180" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <div className="absolute -right-5 -bottom-5 w-40 h-40 border border-[var(--copper)]/30 rounded-lg -z-10" />
          <div className="absolute left-6 -bottom-10 flex items-center gap-2 text-sm text-[var(--subtle)]">
            <MapPin size={15} className="text-[var(--copper)]" />
            {data.location}
          </div>
        </div>
      </div>

      {/* Replaced jumpy bounce with smooth motion */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-[bounce_3s_ease-in-out_infinite] text-[var(--ghost)]">
        <ChevronDown size={20} />
      </div>
    </section>
  );
};

export default Hero;
