import React from 'react';
import { ArrowLeft, Download, ExternalLink, Mail, MapPin } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

interface CVPageProps {
  portfolioHref: string;
}

const CVPage: React.FC<CVPageProps> = ({ portfolioHref }) => {
  const { data } = usePortfolio();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cv-page min-h-screen bg-[#f4efe8] px-4 py-6 text-slate-900 md:px-6 md:py-10">
      <div className="cv-no-print mx-auto mb-6 flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <a
          href={portfolioHref}
          className="inline-flex items-center gap-2 self-start border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-950"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </a>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 border border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          <Download size={16} /> Download PDF
        </button>
      </div>

      <main className="cv-sheet mx-auto flex max-w-5xl flex-col gap-8 border border-slate-200 bg-white px-6 py-8 shadow-[0_22px_70px_rgba(15,23,42,0.12)] md:px-10 md:py-10">
        <header className="cv-section border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Curriculum Vitae</p>
              <div>
                <h1 className="font-fraunces text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">Ruiping Wang</h1>
                <p className="mt-2 text-lg font-medium text-slate-700 md:text-xl">{data.heroTitle}</p>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{data.heroSubtitle}</p>
            </div>

            <div className="grid gap-2 text-sm text-slate-700 md:min-w-[260px]">
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

        <section className="cv-section grid gap-6 md:grid-cols-[1.5fr_0.9fr]">
          <div>
            <h2 className="mb-4 border-b border-slate-200 pb-2 font-fraunces text-2xl font-bold text-slate-950">Professional Experience</h2>
            <div className="space-y-6">
              {data.workExperience.map((job) => (
                <article key={`${job.company}-${job.role}-${job.period}`}>
                  <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{job.role}</h3>
                      <p className="text-sm font-medium text-slate-700">{job.company} · {job.location}</p>
                    </div>
                    <p className="text-sm text-slate-500">{job.period}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{job.description}</p>
                  <p className="mt-2 text-sm text-slate-500"><span className="font-semibold text-slate-700">Tech:</span> {job.tech}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="cv-section">
              <h2 className="mb-4 border-b border-slate-200 pb-2 font-fraunces text-2xl font-bold text-slate-950">Education</h2>
              <div className="space-y-4">
                {data.education.map((item) => (
                  <article key={`${item.school}-${item.degree}`}>
                    <h3 className="text-base font-semibold text-slate-900">{item.degree}</h3>
                    <p className="text-sm font-medium text-slate-700">{item.school}</p>
                    <p className="text-sm text-slate-500">{item.year}</p>
                    {item.details && <p className="mt-1 text-sm leading-6 text-slate-600">{item.details}</p>}
                  </article>
                ))}
              </div>
            </section>

            <section className="cv-section">
              <h2 className="mb-4 border-b border-slate-200 pb-2 font-fraunces text-2xl font-bold text-slate-950">Certifications</h2>
              <ul className="space-y-2 text-sm leading-6 text-slate-600">
                {data.certifications.map((certification) => (
                  <li key={certification}>• {certification}</li>
                ))}
              </ul>
            </section>
          </div>
        </section>

        <section className="cv-section">
          <h2 className="mb-4 border-b border-slate-200 pb-2 font-fraunces text-2xl font-bold text-slate-950">Selected Projects</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {data.projects.map((project) => (
              <article key={project.id} className="rounded-none border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
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
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  {project.tags.join(' · ')}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <h2 className="mb-4 border-b border-slate-200 pb-2 font-fraunces text-2xl font-bold text-slate-950">Skills</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.skillCategories.map((category) => (
              <article key={category.category} className="rounded-none border border-slate-200 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">{category.category}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{category.items.join(' · ')}</p>
              </article>
            ))}
          </div>
        </section>

        <p className="cv-no-print text-sm text-slate-500">
          Use your browser&apos;s print dialog and choose <span className="font-semibold text-slate-700">Save as PDF</span> for a downloadable CV.
        </p>
      </main>
    </div>
  );
};

export default CVPage;