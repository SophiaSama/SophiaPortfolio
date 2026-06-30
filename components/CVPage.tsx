import React, { useRef, useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Loader2, Mail, MapPin } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

interface CVPageProps {
  portfolioHref: string;
}

const CVPage: React.FC<CVPageProps> = ({ portfolioHref }) => {
  const { data } = usePortfolio();
  const sheetRef = useRef<HTMLElement | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const waitForLayout = () => new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) {
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const response = await fetch('/api/cv-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
        },
        body: JSON.stringify({ portfolioData: data }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to generate CV PDF.');
      }

      const pdfBlob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = 'Ruiping-Wang-CV.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download server-generated PDF, falling back to print.', error);
      setIsExportingPdf(true);
      await waitForLayout();
      window.print();
    } finally {
      setIsExportingPdf(false);
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="cv-page min-h-screen bg-[#f4efe8] px-4 py-5 text-slate-900 md:px-6 md:py-8">
      <div className="cv-no-print mx-auto mb-5 flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <a
          href={portfolioHref}
          className="inline-flex items-center gap-2 self-start border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-950"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </a>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="inline-flex items-center justify-center gap-2 border border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <main
        ref={sheetRef}
        className={`cv-sheet mx-auto flex max-w-5xl flex-col border border-slate-200 bg-white ${isExportingPdf ? 'gap-3.5 px-3.5 py-3.5 shadow-none text-[13px] md:px-4 md:py-4' : 'gap-6 px-5 py-6 text-[14px] shadow-[0_22px_70px_rgba(15,23,42,0.12)] md:px-8 md:py-7'}`}
      >
        <header className={`cv-section border-b border-slate-200 ${isExportingPdf ? 'pb-3' : 'pb-4'}`}>
          <div className={`flex flex-col md:flex-row md:items-start md:justify-between ${isExportingPdf ? 'gap-2.5' : 'gap-3'}`}>
            <div className={isExportingPdf ? 'space-y-2' : 'space-y-2.5'}>
              <p className={`${isExportingPdf ? 'text-[10px]' : 'text-xs'} font-semibold uppercase tracking-[0.3em] text-slate-500`}>Curriculum Vitae</p>
              <div>
                <h1 className={`font-fraunces font-bold tracking-tight text-slate-950 ${isExportingPdf ? 'text-[1.6rem] md:text-[1.85rem]' : 'text-3xl md:text-4xl'}`}>Ruiping Wang</h1>
                <p className={`mt-1 font-medium text-slate-700 ${isExportingPdf ? 'text-[14px] md:text-[15px]' : 'text-base md:text-lg'}`}>{data.heroTitle}</p>
              </div>
              <p className={`max-w-3xl text-slate-600 ${isExportingPdf ? 'text-[11px] leading-4.5' : 'text-sm leading-6'}`}>{data.heroSubtitle}</p>
            </div>

            <div className={`grid text-slate-700 md:min-w-[250px] md:pl-4 ${isExportingPdf ? 'gap-1 text-[11px]' : 'gap-1.5 text-sm'}`}>
              <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 hover:text-slate-950">
                <Mail size={15} /> {data.email}
              </a>
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-slate-950"
              >
                <ExternalLink size={15} /> LinkedIn Profile
              </a>
              <div className="inline-flex items-center gap-2">
                <MapPin size={15} /> {data.location}
              </div>
            </div>
          </div>
        </header>

        <section className={`cv-section grid md:grid-cols-[1.55fr_0.85fr] ${isExportingPdf ? 'gap-3.5' : 'gap-5'}`}>
          <div>
            <div className="pdf-heading-block pdf-keep-together">
              <h2 className={`border-b border-slate-200 pb-2 font-fraunces text-[1.45rem] font-bold text-slate-950 ${isExportingPdf ? 'mb-2' : 'mb-3'}`}>Professional Experience</h2>
            </div>
            <div className={isExportingPdf ? 'space-y-2.5' : 'space-y-4.5'}>
              {data.workExperience.map((job) => (
                <article key={`${job.company}-${job.role}-${job.period}`} className="pdf-card pdf-keep-together">
                  <div className="flex flex-col gap-0.5 md:flex-row md:items-start md:justify-between md:gap-3">
                    <div>
                      <h3 className={`font-semibold text-slate-900 ${isExportingPdf ? 'text-[13px]' : 'text-base'}`}>{job.role}</h3>
                      <p className={`${isExportingPdf ? 'text-[10px]' : 'text-sm'} font-medium text-slate-700`}>{job.company} · {job.location}</p>
                    </div>
                    <p className={`${isExportingPdf ? 'text-[9px]' : 'text-xs'} text-slate-500 md:whitespace-nowrap`}>{job.period}</p>
                  </div>
                  <p className={`mt-0.5 text-slate-600 ${isExportingPdf ? 'text-[10px] leading-4' : 'text-[13px] leading-5'}`}>{job.description}</p>
                  <p className={`mt-0.5 text-slate-500 ${isExportingPdf ? 'text-[9px] leading-[0.95rem]' : 'text-[12px] leading-5'}`}><span className="font-semibold text-slate-700">Tech:</span> {job.tech}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={isExportingPdf ? 'space-y-4' : 'space-y-5'}>
            <section className="cv-section pdf-keep-together">
              <div className="pdf-heading-block pdf-keep-together">
                <h2 className={`border-b border-slate-200 pb-2 font-fraunces text-[1.45rem] font-bold text-slate-950 ${isExportingPdf ? 'mb-2' : 'mb-3'}`}>Education</h2>
              </div>
              <div className={isExportingPdf ? 'space-y-2.5' : 'space-y-3'}>
                {data.education.map((item) => (
                  <article key={`${item.school}-${item.degree}`} className="pdf-card pdf-keep-together">
                    <h3 className={`${isExportingPdf ? 'text-[14px]' : 'text-[15px]'} font-semibold text-slate-900`}>{item.degree}</h3>
                    <p className={`${isExportingPdf ? 'text-[11px]' : 'text-sm'} font-medium text-slate-700`}>{item.school}</p>
                    <p className={`${isExportingPdf ? 'text-[10px]' : 'text-xs'} text-slate-500`}>{item.year}</p>
                    {item.details && <p className={`mt-1 text-slate-600 ${isExportingPdf ? 'text-[11px] leading-[1.1rem]' : 'text-[13px] leading-5'}`}>{item.details}</p>}
                  </article>
                ))}
              </div>
            </section>

            <section className="cv-section pdf-keep-together">
              <div className="pdf-heading-block pdf-keep-together">
                <h2 className={`border-b border-slate-200 pb-2 font-fraunces text-[1.45rem] font-bold text-slate-950 ${isExportingPdf ? 'mb-2' : 'mb-3'}`}>Certifications</h2>
              </div>
              <ul className={`grid gap-x-4 text-slate-600 md:grid-cols-1 lg:grid-cols-2 ${isExportingPdf ? 'gap-y-0.5 text-[10px] leading-4' : 'gap-y-1 text-[13px] leading-5'}`}>
                {data.certifications.map((certification) => (
                  <li key={certification}>• {certification}</li>
                ))}
              </ul>
            </section>
          </div>
        </section>

        <section className="cv-section">
          <div className="pdf-heading-block pdf-keep-together">
            <h2 className={`border-b border-slate-200 pb-2 font-fraunces text-[1.45rem] font-bold text-slate-950 ${isExportingPdf ? 'mb-2' : 'mb-3'}`}>Selected Projects</h2>
          </div>
          <div className={`grid md:grid-cols-2 ${isExportingPdf ? 'gap-2.5' : 'gap-3'}`}>
            {data.projects.map((project) => (
              <article key={project.id} className={`pdf-card pdf-keep-together rounded-none border border-slate-200 ${isExportingPdf ? 'p-2.5' : 'p-3'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={`${isExportingPdf ? 'text-[14px]' : 'text-[15px]'} font-semibold text-slate-900`}>{project.title}</h3>
                    <p className={`mt-1 text-slate-600 ${isExportingPdf ? 'text-[11px] leading-[1.1rem]' : 'text-[13px] leading-5'}`}>{project.description}</p>
                  </div>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-slate-500 transition-colors hover:text-slate-900"
                    aria-label={`Open ${project.title} source repository`}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className={`font-medium uppercase tracking-[0.16em] text-slate-500 ${isExportingPdf ? 'mt-1 text-[8px]' : 'mt-2 text-[10px]'}`}>
                  {project.tags.join(' · ')}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <div className="pdf-heading-block pdf-keep-together">
            <h2 className={`border-b border-slate-200 pb-2 font-fraunces text-[1.45rem] font-bold text-slate-950 ${isExportingPdf ? 'mb-2' : 'mb-3'}`}>Skills</h2>
          </div>
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 ${isExportingPdf ? 'gap-2' : 'gap-3'}`}>
            {data.skillCategories.map((category) => (
              <article key={category.category} className={`pdf-card pdf-keep-together rounded-none border border-slate-200 ${isExportingPdf ? 'p-2' : 'p-3'}`}>
                <h3 className={`${isExportingPdf ? 'text-[10px]' : 'text-[11px]'} font-semibold uppercase tracking-[0.16em] text-slate-700`}>{category.category}</h3>
                <p className={`mt-1 text-slate-600 ${isExportingPdf ? 'text-[11px] leading-[1.1rem]' : 'text-[13px] leading-5'}`}>{category.items.join(' · ')}</p>
              </article>
            ))}
          </div>
        </section>

      </main>

      <p className="cv-no-print mx-auto mt-4 max-w-5xl text-sm text-slate-500">
        A PDF file will download directly. If the browser blocks it, the page will fall back to the print dialog.
      </p>
    </div>
  );
};

export default CVPage;