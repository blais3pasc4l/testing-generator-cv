// Server-side HTML renderer — Modern Minimal design
// White bg, warm clay accent (#c25a3a), 2-col experience, dotted separators

export interface CvData {
  name: string;
  role: string;
  contact: { email?: string; phone?: string; location?: string; linkedin?: string };
  status: string;
  metrics: { value: string; label: string }[];
  summary: string;
  experience: {
    company: string;
    client?: string;
    date: string;
    role: string;
    bullets: string[];
  }[];
  skills: { category: string; items: string[] }[];
  certifications?: { year: string; name: string; issuer: string }[];
  education?: { title: string; institution: string; date?: string };
  languages: { name: string; level: string; percent: number }[];
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sectionHeader(label: string): string {
  return `    <div class="cv-sec-header">
      <div class="cv-sec-accent"></div>
      <div class="cv-sec-label">${esc(label)}</div>
      <div class="cv-sec-rule"></div>
    </div>`;
}

export function renderCvHtml(d: CvData): string {
  // Header
  const contactLines: string[] = [];
  if (d.contact.email) contactLines.push(`<div>${esc(d.contact.email)}</div>`);
  if (d.contact.phone) contactLines.push(`<div>${esc(d.contact.phone)}</div>`);
  if (d.contact.linkedin) contactLines.push(`<div class="cv-contact-link">${esc(d.contact.linkedin)}</div>`);

  // Experience
  const jobs = d.experience.map((exp, i) => {
    const bullets = exp.bullets.map(b => `          <li>${esc(b)}</li>`).join('\n');
    const clientHtml = exp.client ? `\n        <div class="cv-job-client">${esc(exp.client)}</div>` : '';
    return `      <div class="cv-job">
        <div>
          <div class="cv-job-date">${esc(exp.date)}</div>
          <div class="cv-job-company">${esc(exp.company)}</div>${clientHtml}
        </div>
        <div>
          <div class="cv-job-role">${esc(exp.role)}</div>
          <ul class="cv-job-bullets">
${bullets}
          </ul>
        </div>
      </div>`;
  }).join('\n');

  // Skills
  const skillRows = d.skills.map(sg =>
    `      <div class="cv-skill-row">
        <div class="cv-skill-cat">${esc(sg.category)}</div>
        <div class="cv-skill-items">${sg.items.map(s => esc(s)).join(', ')}</div>
      </div>`
  ).join('\n');

  // Certifications
  let certsHtml = '';
  if (d.certifications && d.certifications.length > 0) {
    const certs = d.certifications.map(c =>
      `      <div class="cv-cert">
        <div>
          <div class="cv-cert-name">${esc(c.name)}</div>
          <div class="cv-cert-issuer">${esc(c.issuer)}</div>
        </div>
        <div class="cv-cert-year">${esc(c.year)}</div>
      </div>`
    ).join('\n');
    certsHtml = `    <section>
${sectionHeader('Certificaciones')}
${certs}
    </section>`;
  }

  // Education
  let eduHtml = '';
  if (d.education) {
    const dateLine = d.education.date
      ? ` · <span style="font-family:'JetBrains Mono',monospace;font-size:8px">${esc(d.education.date)}</span>`
      : '';
    eduHtml = `    <section>
${sectionHeader('Formación')}
      <div class="cv-edu-title">${esc(d.education.title)}</div>
      <div class="cv-edu-sub">${esc(d.education.institution)}${dateLine}</div>
    </section>`;
  }

  // Languages
  const langs = d.languages.map(l =>
    `      <div class="cv-lang">
        <div class="cv-lang-name">${esc(l.name)}</div>
        <div class="cv-lang-level">${esc(l.level)}</div>
      </div>`
  ).join('\n');

  const location = d.contact.location || d.status || '';

  return `<div class="cv">
  <header class="cv-header">
    <div>
      <h1 class="cv-name">${esc(d.name)}</h1>
      <div class="cv-role-line">
        <span class="cv-role-dot"></span>
        <span class="cv-role">${esc(d.role)}</span>
        <span class="cv-role-sep">·</span>
        <span class="cv-location">${esc(location)}</span>
      </div>
    </div>
    <div class="cv-contact">
${contactLines.map(l => '      ' + l).join('\n')}
    </div>
  </header>

  <section>
    <p class="cv-summary">${esc(d.summary)}</p>
  </section>

  <section>
${sectionHeader('Experiencia')}
${jobs}
  </section>

  <div class="cv-footer">
    <section>
${sectionHeader('Habilidades técnicas')}
      <div class="cv-skills">
${skillRows}
      </div>
    </section>

    <div class="cv-footer-right">
${certsHtml}

${eduHtml}

      <section>
${sectionHeader('Idiomas')}
${langs}
      </section>
    </div>
  </div>
</div>`;
}
