export const SYSTEM_MESSAGE = `Eres un generador de CVs en HTML. Tu ÚNICA función es devolver HTML válido con las clases CSS exactas que te indiquen. NUNCA devuelves markdown, explicaciones, ni texto fuera del HTML. SIEMPRE respetas los límites de longitud al pie de la letra. Si te dicen máximo 3 bullets, pones EXACTAMENTE 3 o menos, NUNCA más.`;

export function buildCvPrompt(masterCv: string, jobOffer: string, lang: string, reduceMore?: boolean): string {
  const maxExp = reduceMore ? 3 : 4;
  const maxBullets = reduceMore ? 3 : 4;
  const maxBulletWords = reduceMore ? 14 : 18;
  const maxSummary = reduceMore ? '1 frase (máximo 25 palabras)' : '2 frases (máximo 40 palabras total)';
  const maxSkillCats = reduceMore ? 4 : 5;

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
• Categorías de skills: MÁXIMO ${maxSkillCats}
• Omitir: Docencia, Voluntariado, Proyectos personales (salvo que la oferta lo pida)
• Certificaciones: máximo 3, solo si son relevantes
• Idiomas: una sola línea

REGLAS DE CONTENIDO:
1. Analiza la oferta → extrae rol, skills clave, requisitos.
2. Selecciona del CV maestro SOLO lo relevante. Reordena por relevancia.
3. Reescribe bullets enfatizando logros que coincidan con la oferta.
4. Idioma del CV: ${lang}.
5. NO inventes datos. Solo reformula y selecciona.

FORMATO — Devuelve SOLO este HTML, sin markdown, sin \`\`\`, sin texto antes ni después:

<div class="cv">
  <h1 class="cv-name">Nombre Apellido</h1>
  <p class="cv-role">[ rol objetivo · X+ años ]</p>
  <div class="cv-contact">
    <span>email@ejemplo.com</span>
    <span>+57 000 000 0000</span>
    <span>Ciudad · Remoto</span>
    <span>linkedin.com/in/usuario</span>
  </div>

  <h2 class="cv-section">Perfil</h2>
  <p class="cv-summary">Dos frases máximo que resuman experiencia alineada con la oferta.</p>

  <h2 class="cv-section">Experiencia</h2>
  <div class="cv-item">
    <div class="cv-item-header">
      <h3 class="cv-item-title">Empresa</h3>
      <span class="cv-item-meta">Mes Año — Mes Año</span>
    </div>
    <p class="cv-item-subtitle">Puesto / Rol</p>
    <ul>
      <li>Logro conciso de máximo ${maxBulletWords} palabras.</li>
      <li>Otro logro con métrica si existe.</li>
      <li>Tercer logro relevante para la oferta.</li>
    </ul>
  </div>

  <h2 class="cv-section">Stack técnico</h2>
  <div class="cv-skill-group">
    <span class="cv-skill-group-label">Categoría:</span>
    <span class="cv-skill-group-items">Skill 1, Skill 2, Skill 3</span>
  </div>

  <h2 class="cv-section">Formación</h2>
  <div class="cv-item">
    <div class="cv-item-header">
      <h3 class="cv-item-title">Titulación</h3>
      <span class="cv-item-meta">Año — Año</span>
    </div>
    <p class="cv-item-subtitle">Institución</p>
  </div>

  <h2 class="cv-section">Idiomas</h2>
  <div class="cv-skill-group">
    <span class="cv-skill-group-items">Español: Nativo · Inglés: B2+</span>
  </div>
</div>

IMPORTANTE:
- Usa EXACTAMENTE las clases CSS mostradas arriba (cv-name, cv-role, cv-section, cv-item, etc.)
- El cv-role DEBE tener formato "[ rol · años ]" con corchetes
- Los nombres de sección deben ser: "Perfil", "Experiencia", "Stack técnico", "Formación", "Idiomas"
- NO uses <style>, <script>, ni elementos fuera del <div class="cv">
- NO añadas clases CSS que no estén en la plantilla
- NO uses text-transform ni estilos inline

Genera el HTML ahora:`;
}
