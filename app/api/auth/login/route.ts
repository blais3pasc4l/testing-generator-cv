import { NextResponse } from 'next/server';
import { createSession, setSessionCookie } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const expected = process.env.APP_PASSWORD;

    if (!expected) {
      return NextResponse.json({ error: 'Servidor mal configurado' }, { status: 500 });
    }
    if (typeof password !== 'string' || password !== expected) {
      // Pequeño delay para frenar ataques de fuerza bruta
      await new Promise(r => setTimeout(r, 500));
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const token = await createSession();
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 });
  }
}
