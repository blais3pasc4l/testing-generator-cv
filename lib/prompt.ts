export function buildCvPrompt(masterCv: string, jobOffer: string, lang: string): string {
  return `Eres un experto en redacción de CVs. Tu tarea es generar un CV PERSONALIZADO en HTML adaptado específicamente a la oferta de trabajo proporcionada.

INSTRUCCIONES CRÍTICAS:
1. Analiza la oferta y extrae: rol, skills clave, requisitos, palabras clave del sector.
2. Del CV maestro, SELECCIONA y REORDENA solo la información más relevante para esa oferta.
3. Reescribe el resumen profesional alineándolo con el puesto concreto.
4. Reordena experiencias destacando primero las más relevantes; reescribe los bullets para enfatizar logros y skills que coincidan con la oferta.
5. En skills, prioriza las que pide la oferta.
6. Idioma del CV: ${lang}.
7. Sé veraz: NO inventes experiencias, empresas, fechas ni titulaciones. Solo reordena, reformula y selecciona.

FORMATO DE SALIDA:
Devuelve ÚNICAMENTE HTML válido (sin markdown, sin \`\`\`, sin explicaciones) usando EXACTAMENTE esta estructura y clases CSS (no inventes clases nuevas):

<div class="cv">
  <h1 class="cv-name">[NOMBRE COMPLETO]</h1>
  <p class="cv-role">[ROL OBJETIVO adaptado a la oferta]</p>
  <div class="cv-contact">
    <span>[email]</span>
    <span>[teléfono]</span>
    <span>[ubicación]</span>
    <span>[linkedin si existe]</span>
  </div>

  <h2 class="cv-section">Resumen</h2>
  <p class="cv-summary">[2-4 frases adaptadas a la oferta]</p>

  <h2 class="cv-section">Experiencia</h2>
  <div class="cv-item">
    <div class="cv-item-header">
      <h3 class="cv-item-title">[Puesto] · [Empresa]</h3>
      <span class="cv-item-meta">[Fecha inicio – fecha fin]</span>
    </div>
    <p class="cv-item-subtitle">[Ubicación o sector si aplica]</p>
    <ul>
      <li>[Logro/responsabilidad orientado a la oferta]</li>
      <li>[Otro logro con métrica si la hay]</li>
    </ul>
  </div>
  [repite cv-item por cada experiencia relevante, máx 4-5]

  <h2 class="cv-section">Formación</h2>
  <div class="cv-item">
    <div class="cv-item-header">
      <h3 class="cv-item-title">[Titulación]</h3>
      <span class="cv-item-meta">[Años]</span>
    </div>
    <p class="cv-item-subtitle">[Institución]</p>
  </div>

  <h2 class="cv-section">Skills</h2>
  <div class="cv-skill-group">
    <span class="cv-skill-group-label">[Categoría, ej: Lenguajes]:</span>
    <span class="cv-skill-group-items">[skills separados por coma]</span>
  </div>
  [repite cv-skill-group por cada categoría]

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
