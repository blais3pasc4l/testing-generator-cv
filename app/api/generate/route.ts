import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAuthenticated } from '@/lib/session';
import { getRedis, CV_KEY } from '@/lib/redis';
import { buildCvPrompt, SYSTEM_MESSAGE } from '@/lib/prompt';
import { renderCvHtml, type CvData } from '@/lib/template';

// Permitir ejecución larga (generación tarda 15-30s)
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Configuración incompleta del servidor' }, { status: 500 });
    }

    const { jobOffer, lang, reduceMore } = await req.json();
    if (typeof jobOffer !== 'string' || jobOffer.trim().length < 50) {
      return NextResponse.json({ error: 'Oferta demasiado corta' }, { status: 400 });
    }

    const redis = getRedis();
    const masterCv = await redis.get<string>(CV_KEY);
    if (!masterCv || masterCv.trim().length < 100) {
      return NextResponse.json(
        { error: 'CV maestro vacío o demasiado corto. Guárdalo primero.' },
        { status: 400 }
      );
    }

    const prompt = buildCvPrompt(masterCv, jobOffer, lang || 'español', reduceMore === true);

    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2500,
      temperature: 0,
      system: SYSTEM_MESSAGE,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = msg.content.find(b => b.type === 'text');
    let raw = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    // Strip markdown wrappers if any
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();

    // Parse JSON
    let cvData: CvData;
    try {
      cvData = JSON.parse(raw);
    } catch {
      console.error('Failed to parse CV JSON:', raw.slice(0, 500));
      return NextResponse.json(
        { error: 'El modelo no devolvió JSON válido. Intenta de nuevo.' },
        { status: 502 }
      );
    }

    // Validate minimum fields
    if (!cvData.name || !cvData.experience || !Array.isArray(cvData.experience)) {
      return NextResponse.json(
        { error: 'El modelo devolvió datos incompletos. Intenta de nuevo.' },
        { status: 502 }
      );
    }

    // Ensure defaults for optional fields
    cvData.metrics = cvData.metrics || [];
    cvData.skills = cvData.skills || [];
    cvData.languages = cvData.languages || [];
    cvData.contact = cvData.contact || {};
    cvData.summary = cvData.summary || '';
    cvData.role = cvData.role || '';
    cvData.status = cvData.status || '';

    // Render HTML with the Engineered template
    const html = renderCvHtml(cvData);

    return NextResponse.json({ html });
  } catch (e: any) {
    console.error('generate error:', e);
    return NextResponse.json(
      { error: 'Error al generar el CV. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
