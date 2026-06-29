import React from 'react';
import { FileText } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

interface HeroProps {
  cvHref: string;
}

const Hero: React.FC<HeroProps> = ({ cvHref }) => {
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
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-end pt-24 md:pt-28 pb-24">

        {/* Massive Typographic Left Scale */}
        <div className="md:col-span-8 flex flex-col justify-end">
          <div className="mb-8 overflow-hidden">
            <span className="inline-block border border-[var(--paper)] px-4 py-1 text-xs font-bold tracking-[0.2em] uppercase text-[var(--paper)]">
              Automotive Connectivity &bull; AI Systems
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-fraunces leading-tight tracking-tight text-[var(--paper)] uppercase">
            {data.heroTitle.split(',')[0]}
            <span className="block text-2xl md:text-3xl lg:text-4xl font-light tracking-wide lowercase mt-2 italic opacity-80">
              connected systems.
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
              <span className="text-2xl font-fraunces font-bold">Digital Key</span>
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

          <a
            href={cvHref}
            className="inline-flex items-center justify-center gap-2 mt-3 border border-[var(--line)] px-6 py-3 text-[var(--paper)] font-bold uppercase tracking-widest text-xs hover:border-[var(--paper)] hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-colors"
          >
            <FileText size={16} /> Open CV / PDF View
          </a>
        </div>

      </div>
    </section>
  );
};

export default Hero;
