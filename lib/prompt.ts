export function buildCvPrompt(masterCv: string, jobOffer: string, lang: string, reduceMore?: boolean): string {
  const reduceBlock = reduceMore
    ? `\nIMPORTANTE: el intento anterior se desbordó. Reduce drásticamente: máximo 3 experiencias, máximo 3 bullets por experiencia, bullets ≤14 palabras, resumen de 1 frase, máximo 4 categorías de skills.`
    : '';

  return `REGLA INVIOLABLE: el CV resultante DEBE caber EN UNA SOLA HOJA A4. Esta regla es más importante que incluir información. Si dudas, RECORTA.

Eres un experto en redacción de CVs técnicos. Tu tarea es generar un CV PERSONALIZADO en HTML adaptado a la oferta de trabajo proporcionada.

RESTRICCIONES DE LONGITUD (1 PÁGINA):
- Máximo 3-4 experiencias (solo las más relevantes para la oferta).
- Máximo 3-4 bullets por experiencia; cada bullet ≤18 palabras.
- Resumen profesional: 2 frases máximo.
- Skills agrupadas en máximo 4-6 categorías, lista breve por categoría.
- Omite secciones como "Docencia", "Voluntariado", "Proyectos personales" salvo que sean centrales para la oferta.
- Omite certificaciones poco relevantes.
- Idiomas: una línea compacta.

INSTRUCCIONES:
1. Analiza la oferta y extrae: rol, skills clave, requisitos, palabras clave del sector.
2. Del CV maestro, SELECCIONA y REORDENA solo la información más relevante para esa oferta.
3. Reescribe el resumen profesional alineándolo con el puesto concreto.
4. Reordena experiencias destacando primero las más relevantes; reescribe los bullets para enfatizar logros y skills que coincidan con la oferta.
5. En skills, prioriza las que pide la oferta.
6. Idioma del CV: ${lang}.
7. Sé veraz: NO inventes experiencias, empresas, fechas ni titulaciones. Solo reordena, reformula y selecciona.
${reduceBlock}
FORMATO DE SALIDA:
Devuelve ÚNICAMENTE el HTML (sin markdown, sin \`\`\`, sin explicaciones) usando EXACTAMENTE esta estructura y clases CSS:

<div class="cv">
  <h1 class="cv-name">[NOMBRE COMPLETO]</h1>
  <p class="cv-role">[ ROL OBJETIVO · AÑOS EXPERIENCIA ]</p>
  <div class="cv-contact">
    <span>[email]</span>
    <span>[teléfono]</span>
    <span>[ubicación]</span>
    <span>[linkedin si existe]</span>
  </div>

  <h2 class="cv-section">Perfil</h2>
  <p class="cv-summary">[2 frases MAX adaptadas a la oferta]</p>

  <h2 class="cv-section">Experiencia</h2>
  <div class="cv-item">
    <div class="cv-item-header">
      <h3 class="cv-item-title">[Empresa]</h3>
      <span class="cv-item-meta">[Fecha inicio — fecha fin]</span>
    </div>
    <p class="cv-item-subtitle">[Puesto]</p>
    <ul>
      <li>[Logro/responsabilidad ≤18 palabras]</li>
    </ul>
  </div>

  <h2 class="cv-section">Stack técnico</h2>
  <div class="cv-skill-group">
    <span class="cv-skill-group-label">[Categoría]:</span>
    <span class="cv-skill-group-items">[skills separados por coma]</span>
  </div>

  <h2 class="cv-section">Formación</h2>
  <div class="cv-item">
    <div class="cv-item-header">
      <h3 class="cv-item-title">[Titulación]</h3>
      <span class="cv-item-meta">[Años]</span>
    </div>
    <p class="cv-item-subtitle">[Institución]</p>
  </div>

  <h2 class="cv-section">Idiomas</h2>
  <div class="cv-skill-group">
    <span class="cv-skill-group-items">[Idioma 1: nivel · Idioma 2: nivel]</span>
  </div>
</div>

Omite secciones para las que no haya datos en el CV maestro. NO incluyas <style>, <script>, ni elementos fuera del <div class="cv">.

=== CV MAESTRO ===
${masterCv}

=== OFERTA DE TRABAJO ===
${jobOffer}

Genera ahora el HTML del CV personalizado:`;
}
