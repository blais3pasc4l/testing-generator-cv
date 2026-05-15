'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error');
        setLoading(false);
        return;
      }
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error de red');
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Generador de CV</h1>
        <p className="subtitle">Introduce tu contraseña para continuar</p>

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
          required
        />

        {error && <div className="status error" style={{ marginTop: 12 }}>{error}</div>}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !password}
          style={{ marginTop: 16 }}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
