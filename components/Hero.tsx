import React from 'react';
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
    <section className="min-h-[65vh] flex flex-col justify-center px-6 bg-[var(--ink)] border-b border-[var(--paper)]">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-end pt-12 pb-24">

        {/* Massive Typographic Left Scale */}
        <div className="md:col-span-8 flex flex-col justify-end">
          <div className="mb-8 overflow-hidden">
            <span className="inline-block border border-[var(--paper)] px-4 py-1 text-xs font-bold tracking-[0.2em] uppercase text-[var(--paper)]">
              Automotive Connectivity &bull; AI Systems
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-fraunces leading-[0.9] tracking-tighter text-[var(--paper)] uppercase">
            {data.heroTitle.split(',')[0]}
            <span className="block text-4xl md:text-6xl lg:text-7xl font-light tracking-tight lowercase mt-4 italic opacity-80">
              secure systems.
            </span>
          </h1>
        </div>

        {/* Dense Description Right Scale */}
        <div className="md:col-span-4 flex flex-col gap-8 pb-4">
          <p className="text-xl md:text-2xl text-[var(--paper)] font-light leading-snug">
            {data.heroSubtitle}
          </p>

          <div className="flex flex-col gap-0 border-y border-[var(--paper)] divide-y divide-[var(--paper)] w-full">
            <div className="py-4 flex justify-between items-baseline group hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-colors cursor-default px-2">
              <span className="text-sm font-semibold uppercase tracking-widest">Experience</span>
              <span className="text-2xl font-fraunces font-bold">13+ Yrs</span>
            </div>
            <div className="py-4 flex justify-between items-baseline group hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-colors cursor-default px-2">
              <span className="text-sm font-semibold uppercase tracking-widest">Core</span>
              <span className="text-2xl font-fraunces font-bold">UWB / BLE</span>
            </div>
            <div className="py-4 flex justify-between items-baseline group hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-colors cursor-default px-2">
              <span className="text-sm font-semibold uppercase tracking-widest">Focus</span>
              <span className="text-2xl font-fraunces font-bold">Applied AI</span>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <a
              href="#projects"
              onClick={scrollToSection('projects')}
              className="flex-1 text-center py-4 border border-[var(--paper)] bg-[var(--paper)] text-[var(--ink)] font-bold uppercase tracking-widest text-xs hover:bg-transparent hover:text-[var(--paper)] transition-colors"
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={scrollToSection('contact')}
              className="flex-1 text-center py-4 border border-[var(--paper)] text-[var(--paper)] font-bold uppercase tracking-widest text-xs hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
