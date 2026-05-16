export const SYSTEM_MESSAGE = `Eres un generador de CVs. Devuelves SOLO JSON válido, sin markdown, sin explicaciones, sin texto extra. Respetas siempre los límites de longitud.`;

export function buildCvPrompt(masterCv: string, jobOffer: string, lang: string, reduceMore?: boolean): string {
  const maxExp = reduceMore ? 3 : 4;
  const maxBullets = reduceMore ? 2 : 3;
  const maxBulletWords = reduceMore ? 14 : 18;
  const maxSummaryWords = reduceMore ? 20 : 40;
  const maxSkillCats = reduceMore ? 4 : 6;

  return `Genera un CV personalizado para la oferta. Devuelve SOLO JSON válido.

=== CV MAESTRO ===
${masterCv}

=== OFERTA ===
${jobOffer}

=== REGLAS ===
- Idioma: ${lang}
- UNA PÁGINA A4: recorta si es necesario
- Máximo ${maxExp} experiencias, ${maxBullets} bullets cada una (≤${maxBulletWords} palabras/bullet)
- Resumen: máximo ${maxSummaryWords} palabras
- Máximo ${maxSkillCats} categorías de skills, 5 items por categoría
- Máximo 3 certificaciones relevantes
- Omitir Docencia/Voluntariado salvo que la oferta lo pida
- NO inventes datos

=== FORMATO JSON ===
{
  "name": "Nombre Apellido",
  "role": "rol objetivo · X+ años",
  "contact": { "email": "...", "phone": "...", "location": "...", "linkedin": "..." },
  "status": "Ciudad · Remoto/Híbrido/Presencial",
  "summary": "Dos frases máximo alineadas con la oferta.",
  "experience": [
    {
      "company": "Empresa",
      "client": "Cliente (omitir si no hay)",
      "date": "Mes Año — Mes Año",
      "role": "Puesto",
      "bullets": ["Logro 1", "Logro 2", "Logro 3"]
    }
  ],
  "skills": [
    { "category": "Nombre Categoría", "items": ["Skill1", "Skill2", "Skill3"] }
  ],
  "certifications": [
    { "year": "2024", "name": "Certificación", "issuer": "Emisor" }
  ],
  "education": { "title": "Titulación", "institution": "Universidad", "date": "Año" },
  "languages": [
    { "name": "Español", "level": "Nativo", "percent": 100 },
    { "name": "Inglés", "level": "B2+", "percent": 75 }
  ]
}

IMPORTANTE:
- Si no hay certificaciones, pon array vacío []
- Si no hay client, omite el campo
- percent de idiomas: Nativo=100, C2=95, C1=85, B2=75, B1=60, A2=40
- Devuelve SOLO el JSON, nada más`;
}
