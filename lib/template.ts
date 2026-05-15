// Server-side HTML renderer for the Engineered CV design.
// The model returns JSON data, this function builds the exact HTML.

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

export function renderCvHtml(d: CvData): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  let num = 1;

  // Contact
  const contactSpans = [d.contact.email, d.contact.phone, d.contact.location, d.contact.linkedin]
    .filter(Boolean)
    .map(c => `<span>${esc(c!)}</span>`)
    .join('\n        ');

  // Metrics
  const metricsHtml = d.metrics.slice(0, 4).map(m =>
    `      <div class="cv-metric">
        <span class="cv-metric-value">${esc(m.value)}</span>
        <span class="cv-metric-label">${esc(m.label)}</span>
      </div>`
  ).join('\n');

  // Sections
  const sections: string[] = [];

  // 01 Perfil
  sections.push(`    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">${pad(num++)}</span>
        <span class="cv-section-title">Perfil</span>
      </div>
      <p class="cv-summary">${esc(d.summary)}</p>
    </section>`);

  // 02 Experiencia
  const expItems = d.experience.map(exp => {
    const clientHtml = exp.client ? ` <span class="cv-item-client">${esc(exp.client)}</span>` : '';
    const bulletsHtml = exp.bullets.map(b => `          <li>${esc(b)}</li>`).join('\n');
    return `      <div class="cv-item">
        <div class="cv-item-header">
          <div><span class="cv-item-title">${esc(exp.company)}</span>${clientHtml}</div>
          <span class="cv-item-meta">${esc(exp.date)}</span>
        </div>
        <p class="cv-item-subtitle">${esc(exp.role)}</p>
        <ul>
${bulletsHtml}
        </ul>
      </div>`;
  }).join('\n');

  sections.push(`    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">${pad(num++)}</span>
        <span class="cv-section-title">Experiencia profesional</span>
        <span class="cv-section-count">${d.experience.length} roles</span>
      </div>
${expItems}
    </section>`);

  // 03 Stack técnico
  const skillGroups = d.skills.map(sg => {
    const tags = sg.items.map(s => `          <span class="cv-skill-tag">${esc(s)}</span>`).join('\n');
    return `        <div class="cv-skill-group">
          <span class="cv-skill-group-label">${esc(sg.category)}</span>
          <div class="cv-skill-tags">
${tags}
          </div>
        </div>`;
  }).join('\n');

  sections.push(`    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">${pad(num++)}</span>
        <span class="cv-section-title">Stack técnico</span>
      </div>
      <div class="cv-skills-grid">
${skillGroups}
      </div>
    </section>`);

  // Certificaciones (optional)
  if (d.certifications && d.certifications.length > 0) {
    const certs = d.certifications.map(c =>
      `      <div class="cv-cert">
        <span class="cv-cert-year">${esc(c.year)}</span>
        <span class="cv-cert-name">${esc(c.name)}</span>
        <span class="cv-cert-issuer">${esc(c.issuer)}</span>
      </div>`
    ).join('\n');
    sections.push(`    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">${pad(num++)}</span>
        <span class="cv-section-title">Certificaciones</span>
      </div>
${certs}
    </section>`);
  }

  // Formación (optional)
  if (d.education) {
    sections.push(`    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">${pad(num++)}</span>
        <span class="cv-section-title">Formación</span>
      </div>
      <div class="cv-edu-title">${esc(d.education.title)}</div>
      <div class="cv-edu-institution">${esc(d.education.institution)}</div>${d.education.date ? `\n      <div class="cv-edu-date">${esc(d.education.date)}</div>` : ''}
    </section>`);
  }

  // Idiomas
  const langs = d.languages.map(l =>
    `      <div class="cv-lang-row">
        <span class="cv-lang-name">${esc(l.name)}</span>
        <div class="cv-lang-bar"><div class="cv-lang-bar-fill" style="width:${Math.min(100, Math.max(0, l.percent))}%"></div></div>
        <span class="cv-lang-level">${esc(l.level)}</span>
      </div>`
  ).join('\n');

  sections.push(`    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">${pad(num++)}</span>
        <span class="cv-section-title">Idiomas</span>
      </div>
${langs}
    </section>`);

  return `<div class="cv">
  <div class="cv-header">
    <div class="cv-header-left">
      <p class="cv-role">[ ${esc(d.role)} ]</p>
      <h1 class="cv-name">${esc(d.name)}</h1>
      <div class="cv-contact">
        ${contactSpans}
      </div>
    </div>
    <div class="cv-header-right">
      <p class="cv-status-label">STATUS</p>
      <p class="cv-status-value">${esc(d.status)}</p>
    </div>
  </div>

  <div class="cv-metrics">
${metricsHtml}
  </div>

  <div class="cv-sections">
${sections.join('\n\n')}
  </div>
</div>`;
}
