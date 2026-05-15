import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/session';
import { getRedis, CV_KEY } from '@/lib/redis';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  try {
    const redis = getRedis();
    const value = await redis.get<string>(CV_KEY);
    return NextResponse.json({ cv: value || '' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  try {
    const { cv } = await req.json();
    if (typeof cv !== 'string') {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }
    const redis = getRedis();
    await redis.set(CV_KEY, cv);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 });
  }
}
