export const SYSTEM_MESSAGE = `Eres un generador de CVs en HTML. Tu ÚNICA función es devolver HTML válido con las clases CSS exactas que te indiquen. NUNCA devuelves markdown, explicaciones, ni texto fuera del HTML. SIEMPRE respetas los límites de longitud al pie de la letra.`;

export function buildCvPrompt(masterCv: string, jobOffer: string, lang: string, reduceMore?: boolean): string {
  const maxExp = reduceMore ? 3 : 4;
  const maxBullets = reduceMore ? 2 : 3;
  const maxBulletWords = reduceMore ? 14 : 18;
  const maxSummary = reduceMore ? '1 frase (máximo 20 palabras)' : '2 frases (máximo 40 palabras total)';
  const maxSkillCats = reduceMore ? 4 : 6;

  return `=== CV MAESTRO (datos fuente) ===
${masterCv}

=== OFERTA DE TRABAJO ===
${jobOffer}

=== INSTRUCCIONES ===

REGLA #1 — UNA PÁGINA: El CV DEBE caber en UNA hoja A4. Es mejor omitir información que desbordar.

LÍMITES ESTRICTOS (violar cualquiera es un error):
• Experiencias: MÁXIMO ${maxExp} (las más relevantes para la oferta)
• Bullets por experiencia: MÁXIMO ${maxBullets}, cada uno ≤${maxBulletWords} palabras
• Perfil/resumen: ${maxSummary}
• Categorías de skills: MÁXIMO ${maxSkillCats}, máximo 5 skills por categoría
• Métricas del header: EXACTAMENTE 4, extraídas del CV (ej: "5+", "99.9%", "M+", "−40%")
• Certificaciones: máximo 3, solo si son relevantes
• Idiomas: 2-3 filas
• Omitir: Docencia, Voluntariado, Proyectos personales (salvo que la oferta lo pida)

REGLAS DE CONTENIDO:
1. Analiza la oferta → extrae rol, skills clave, requisitos.
2. Selecciona del CV maestro SOLO lo relevante. Reordena por relevancia.
3. Reescribe bullets enfatizando logros que coincidan con la oferta.
4. Idioma del CV: ${lang}.
5. NO inventes datos. Solo reformula y selecciona.

FORMATO — Devuelve SOLO este HTML, sin markdown, sin \`\`\`, sin texto antes ni después.
Usa EXACTAMENTE estas clases CSS, NO inventes otras, NO uses estilos inline:

<div class="cv">
  <div class="cv-header">
    <div class="cv-header-left">
      <p class="cv-role">[ rol objetivo · X+ años ]</p>
      <h1 class="cv-name">Nombre Apellido</h1>
      <div class="cv-contact">
        <span>email@ejemplo.com</span>
        <span>+57 000 000 0000</span>
        <span>linkedin.com/in/usuario</span>
      </div>
    </div>
    <div class="cv-header-right">
      <p class="cv-status-label">STATUS</p>
      <p class="cv-status-value">Ciudad · Remoto</p>
    </div>
  </div>

  <div class="cv-metrics">
    <div class="cv-metric">
      <span class="cv-metric-value">5+</span>
      <span class="cv-metric-label">AÑOS EN X</span>
    </div>
    <div class="cv-metric">
      <span class="cv-metric-value">99.9%</span>
      <span class="cv-metric-label">MÉTRICA CLAVE</span>
    </div>
    <div class="cv-metric">
      <span class="cv-metric-value">M+</span>
      <span class="cv-metric-label">OTRA MÉTRICA</span>
    </div>
    <div class="cv-metric">
      <span class="cv-metric-value">−40%</span>
      <span class="cv-metric-label">MEJORA LOGRADA</span>
    </div>
  </div>

  <div class="cv-sections">
    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">01</span>
        <span class="cv-section-title">Perfil</span>
      </div>
      <p class="cv-summary">Dos frases máximo alineadas con la oferta.</p>
    </section>

    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">02</span>
        <span class="cv-section-title">Experiencia profesional</span>
        <span class="cv-section-count">N roles</span>
      </div>
      <div class="cv-item">
        <div class="cv-item-header">
          <div><span class="cv-item-title">Empresa</span> <span class="cv-item-client">Cliente: X</span></div>
          <span class="cv-item-meta">Mes Año — Mes Año</span>
        </div>
        <p class="cv-item-subtitle">Puesto / Rol</p>
        <ul>
          <li>Logro conciso máximo ${maxBulletWords} palabras.</li>
          <li>Otro logro con métrica si existe.</li>
          <li>Tercer logro relevante para la oferta.</li>
        </ul>
      </div>
    </section>

    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">03</span>
        <span class="cv-section-title">Stack técnico</span>
      </div>
      <div class="cv-skills-grid">
        <div class="cv-skill-group">
          <span class="cv-skill-group-label">Categoría</span>
          <div class="cv-skill-tags">
            <span class="cv-skill-tag">Skill 1</span>
            <span class="cv-skill-tag">Skill 2</span>
            <span class="cv-skill-tag">Skill 3</span>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">04</span>
        <span class="cv-section-title">Certificaciones</span>
      </div>
      <div class="cv-cert">
        <span class="cv-cert-year">2024</span>
        <span class="cv-cert-name">Nombre Certificación</span>
        <span class="cv-cert-issuer">Emisor</span>
      </div>
    </section>

    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">05</span>
        <span class="cv-section-title">Formación</span>
      </div>
      <div class="cv-edu-title">Titulación</div>
      <div class="cv-edu-institution">Institución</div>
      <div class="cv-edu-date">Año — Año</div>
    </section>

    <section>
      <div class="cv-section-header">
        <span class="cv-section-num">06</span>
        <span class="cv-section-title">Idiomas</span>
      </div>
      <div class="cv-lang-row">
        <span class="cv-lang-name">Español</span>
        <div class="cv-lang-bar"><div class="cv-lang-bar-fill" style="width:100%"></div></div>
        <span class="cv-lang-level">Nativo</span>
      </div>
      <div class="cv-lang-row">
        <span class="cv-lang-name">Inglés</span>
        <div class="cv-lang-bar"><div class="cv-lang-bar-fill" style="width:75%"></div></div>
        <span class="cv-lang-level">B2+</span>
      </div>
    </section>
  </div>
</div>

IMPORTANTE:
- Usa EXACTAMENTE las clases CSS del template. No inventes otras.
- El cv-role DEBE tener formato "[ rol · años ]" con corchetes.
- Las métricas deben ser 4, extraídas de logros reales del CV maestro.
- Los números de sección van 01, 02, 03...
- Los bullets de experiencia van en <li> dentro de <ul>.
- Los skills van como <span class="cv-skill-tag"> individuales, NO separados por coma.
- La barra de idiomas usa style="width:XX%" donde XX es: Nativo=100, C2=95, C1=85, B2=75, B1=60, A2=40.
- Omite la sección de cv-item-client si la experiencia no tiene cliente.
- Omite secciones sin datos.
- NO uses <style>, <script>, ni estilos inline (excepto el width del cv-lang-bar-fill).
- NO añadas texto fuera del <div class="cv">.

Genera el HTML ahora:`;
}
