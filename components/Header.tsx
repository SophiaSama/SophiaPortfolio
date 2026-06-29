import React, { useState, useEffect } from 'react';
import { Menu, X, CircuitBoard, Moon, Sun, FileText } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  cvHref: string;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, cvHref }) => {
  const { data } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-[var(--ink)]/90 backdrop-blur-md border-b border-[var(--line)] py-3' : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="border border-[var(--copper)]/50 bg-[var(--panel-soft)] p-2 rounded-md group-hover:border-[var(--paper)]/40 transition-colors">
            <CircuitBoard size={22} className="text-[var(--copper)]" />
          </div>
          <span className="text-lg font-semibold text-[var(--paper)] tracking-tight">
            Ruiping Wang
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href={data.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-[var(--paper)] hover:opacity-90 text-[var(--ink)] text-sm font-semibold rounded-md border border-[var(--paper)] transition-all"
          >
            LinkedIn
          </a>
          <a
            href={cvHref}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md border border-[var(--line)] text-[var(--paper)] hover:border-[var(--paper)] hover:bg-[var(--paper)] hover:text-[var(--ink)] transition-all"
          >
            <FileText size={16} /> CV / PDF
          </a>
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-[var(--paper)] hover:border-[var(--copper)]/60 hover:text-[var(--copper)] transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-[var(--paper)]"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="text-[var(--paper)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--panel)] border-b border-[var(--line)] p-6 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-base font-medium text-[var(--body)] hover:text-[var(--paper)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href={data.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-[var(--copper)]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            View LinkedIn Resume
          </a>
          <a
            href={cvHref}
            className="inline-flex items-center gap-2 text-base font-medium text-[var(--paper)]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FileText size={16} /> Open CV / PDF View
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
