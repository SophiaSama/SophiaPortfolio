import chromium from '@sparticuz/chromium';
import { chromium as playwrightChromium } from 'playwright-core';
import type { PortfolioData } from '../types';

const json = (body: unknown, init?: ResponseInit) => {
  return Response.json(body, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
};

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const isPortfolioData = (value: unknown): value is PortfolioData => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<PortfolioData>;
  return (
    typeof candidate.heroTitle === 'string' &&
    typeof candidate.heroSubtitle === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.linkedinUrl === 'string' &&
    typeof candidate.location === 'string' &&
    Array.isArray(candidate.projects) &&
    Array.isArray(candidate.workExperience) &&
    Array.isArray(candidate.education) &&
    Array.isArray(candidate.certifications) &&
    Array.isArray(candidate.skillCategories)
  );
};

const renderList = (items: string[]) => {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
};

const renderLink = (href: string, label: string, className = '') => {
  return `<a href="${escapeHtml(href)}"${className ? ` class="${className}"` : ''}>${escapeHtml(label)}</a>`;
};

const renderCvHtml = (data: PortfolioData) => {
  const experience = data.workExperience.map((job) => `
    <article class="experience-item">
      <div class="row heading-row">
        <div>
          <h3>${escapeHtml(job.role)}</h3>
          <p class="meta strong">${escapeHtml(job.company)} · ${escapeHtml(job.location)}</p>
        </div>
        <p class="meta period">${escapeHtml(job.period)}</p>
      </div>
      <p class="body-copy">${escapeHtml(job.description)}</p>
      <p class="tech"><span>Tech:</span> ${escapeHtml(job.tech)}</p>
    </article>
  `).join('');

  const education = data.education.map((item) => `
    <article class="compact-card">
      <h3>${escapeHtml(item.degree)}</h3>
      <p class="meta strong">${escapeHtml(item.school)}</p>
      <p class="meta">${escapeHtml(item.year)}</p>
      ${item.details ? `<p class="body-copy small">${escapeHtml(item.details)}</p>` : ''}
    </article>
  `).join('');

  const projects = data.projects.map((project) => `
    <article class="compact-card">
      <div class="row project-header">
        <h3>${escapeHtml(project.title)}</h3>
        ${renderLink(project.githubUrl, 'Source', 'link-label')}
      </div>
      <p class="body-copy small">${escapeHtml(project.description)}</p>
      <p class="tagline">${escapeHtml(project.tags.join(' · '))}</p>
    </article>
  `).join('');

  const skillCategories = data.skillCategories.map((category) => `
    <article class="compact-card skill-card">
      <h3 class="skill-heading">${escapeHtml(category.category)}</h3>
      <p class="body-copy small">${escapeHtml(category.items.join(' · '))}</p>
    </article>
  `).join('');

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Ruiping Wang CV</title>
      <style>
        @page {
          size: A4;
          margin: 7mm;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          color: #0f172a;
          background: #ffffff;
          font-family: "IBM Plex Sans", "Segoe UI", Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .page {
          width: 100%;
          padding: 14px 16px 16px;
        }

        .header {
          border-bottom: 1px solid #dbe0e6;
          padding-bottom: 10px;
          margin-bottom: 12px;
          display: grid;
          grid-template-columns: 1.65fr 0.85fr;
          gap: 16px;
        }

        .eyebrow {
          margin: 0 0 6px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #64748b;
        }

        h1 {
          margin: 0;
          font-family: "Fraunces", Georgia, serif;
          font-size: 28px;
          line-height: 1.05;
          font-weight: 700;
        }

        .subtitle {
          margin: 4px 0 0;
          font-size: 14px;
          color: #334155;
          font-weight: 600;
        }

        .summary {
          margin: 8px 0 0;
          font-size: 11px;
          line-height: 1.4;
          color: #475569;
          max-width: 96%;
        }

        .contact {
          display: grid;
          gap: 4px;
          align-content: start;
          font-size: 11px;
          color: #334155;
          padding-top: 4px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1.58fr 0.82fr;
          gap: 14px;
          align-items: start;
        }

        .section {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .section + .section {
          margin-top: 12px;
        }

        .section-title {
          margin: 0 0 8px;
          padding-bottom: 5px;
          border-bottom: 1px solid #dbe0e6;
          font-family: "Fraunces", Georgia, serif;
          font-size: 21px;
          line-height: 1.1;
          font-weight: 700;
          break-after: avoid;
          page-break-after: avoid;
        }

        .experience-item,
        .compact-card,
        .section-title-wrap {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .experience-item + .experience-item {
          margin-top: 8px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          align-items: flex-start;
        }

        .heading-row h3,
        .compact-card h3 {
          margin: 0;
          font-size: 13px;
          line-height: 1.15;
          font-weight: 700;
          color: #0f172a;
        }

        .meta {
          margin: 2px 0 0;
          font-size: 10px;
          line-height: 1.25;
          color: #64748b;
        }

        .meta.strong {
          color: #334155;
          font-weight: 600;
        }

        .period {
          white-space: nowrap;
          padding-top: 1px;
        }

        .body-copy {
          margin: 4px 0 0;
          font-size: 10px;
          line-height: 1.32;
          color: #475569;
        }

        .body-copy.small {
          line-height: 1.25;
        }

        .tech {
          margin: 3px 0 0;
          font-size: 9px;
          line-height: 1.2;
          color: #64748b;
        }

        .tech span {
          color: #334155;
          font-weight: 600;
        }

        .sidebar-stack {
          display: grid;
          gap: 10px;
        }

        .compact-card {
          border: 1px solid #dbe0e6;
          padding: 8px;
        }

        .bullet-list {
          margin: 0;
          padding-left: 14px;
          columns: 2;
          column-gap: 14px;
          font-size: 9px;
          line-height: 1.3;
          color: #475569;
        }

        .bullet-list li {
          margin-bottom: 2px;
        }

        .project-grid,
        .skill-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .project-header {
          margin-bottom: 3px;
        }

        .tagline {
          margin: 4px 0 0;
          font-size: 8px;
          line-height: 1.2;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .link-label {
          display: inline-block;
          font-size: 8px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding-top: 1px;
          text-decoration: none;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .skill-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .skill-heading {
          font-size: 9px !important;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #334155;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <header class="header section">
          <div>
            <p class="eyebrow">Curriculum Vitae</p>
            <h1>${escapeHtml('Ruiping Wang')}</h1>
            <p class="subtitle">${escapeHtml(data.heroTitle)}</p>
            <p class="summary">${escapeHtml(data.heroSubtitle)}</p>
          </div>
          <div class="contact">
            <div>${renderLink(`mailto:${data.email}`, data.email)}</div>
            <div>LinkedIn: ${renderLink(data.linkedinUrl, data.linkedinUrl)}</div>
            <div>${escapeHtml(data.location)}</div>
          </div>
        </header>

        <div class="content-grid">
          <div>
            <section class="section">
              <div class="section-title-wrap"><h2 class="section-title">Professional Experience</h2></div>
              ${experience}
            </section>
          </div>

          <div class="sidebar-stack">
            <section class="section">
              <div class="section-title-wrap"><h2 class="section-title">Education</h2></div>
              ${education}
            </section>

            <section class="section">
              <div class="section-title-wrap"><h2 class="section-title">Certifications</h2></div>
              <ul class="bullet-list">${renderList(data.certifications)}</ul>
            </section>
          </div>
        </div>

        <section class="section">
          <div class="section-title-wrap"><h2 class="section-title">Selected Projects</h2></div>
          <div class="project-grid">${projects}</div>
        </section>

        <section class="section">
          <div class="section-title-wrap"><h2 class="section-title">Skills</h2></div>
          <div class="skill-grid">${skillCategories}</div>
        </section>
      </div>
    </body>
  </html>`;
};

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, { status: 405 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const portfolioData = (body as { portfolioData?: unknown })?.portfolioData;
    if (!isPortfolioData(portfolioData)) {
      return json({ error: 'Valid portfolio data is required.' }, { status: 400 });
    }

    let browser;
    try {
      browser = await playwrightChromium.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });

      const page = await browser.newPage();
      await page.setContent(renderCvHtml(portfolioData), { waitUntil: 'load' });
      await page.emulateMedia({ media: 'print' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm',
        },
      });

      return new Response(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Ruiping-Wang-CV.pdf"',
          'Cache-Control': 'no-store',
        },
      });
    } catch (error) {
      console.error('CV PDF generation failed:', error);
      return json({ error: 'Failed to generate CV PDF.' }, { status: 500 });
    } finally {
      await browser?.close();
    }
  },
};