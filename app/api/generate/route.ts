import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAuthenticated } from '@/lib/session';
import { getRedis, CV_KEY } from '@/lib/redis';
import { buildCvPrompt } from '@/lib/prompt';

// Permitir ejecución larga (generación tarda 15-30s)
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY no configurada' }, { status: 500 });
    }

    const { jobOffer, lang } = await req.json();
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

    const prompt = buildCvPrompt(masterCv, jobOffer, lang || 'español');

    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = msg.content.find(b => b.type === 'text');
    let html = textBlock && textBlock.type === 'text' ? textBlock.text : '';
    html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();

    if (!html.includes('class="cv"')) {
      return NextResponse.json(
        { error: 'El modelo no devolvió la estructura esperada. Intenta de nuevo.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ html });
  } catch (e: any) {
    console.error('generate error:', e);
    return NextResponse.json(
      { error: e.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}
