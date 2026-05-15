'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Generator() {
  const router = useRouter();
  const [masterCv, setMasterCv] = useState('');
  const [savedCv, setSavedCv] = useState(''); // último valor confirmado por servidor
  const [jobOffer, setJobOffer] = useState('');
  const [targetLang, setTargetLang] = useState('español');
  const [cvHtml, setCvHtml] = useState('');
  const [status, setStatus] = useState<{ msg: string; type: 'loading' | 'error' | 'success' } | null>(null);
  const [generating, setGenerating] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cargar CV maestro al entrar
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/cv');
        if (res.ok) {
          const data = await res.json();
          setMasterCv(data.cv || '');
          setSavedCv(data.cv || '');
        }
      } catch {}
    })();
  }, []);

  // Autosave del CV maestro al servidor (con debounce de 1s)
  useEffect(() => {
    if (masterCv === savedCv) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/cv', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cv: masterCv }),
        });
        if (res.ok) setSavedCv(masterCv);
      } catch {}
    }, 1000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [masterCv, savedCv]);

  async function handleGenerate(reduceMore = false) {
    if (masterCv.trim().length < 100) {
      setStatus({ msg: '⚠ El CV maestro está muy corto. Pega toda tu información profesional.', type: 'error' });
      return;
    }
    if (jobOffer.trim().length < 50) {
      setStatus({ msg: '⚠ La oferta es muy corta. Pega la descripción completa.', type: 'error' });
      return;
    }
    setGenerating(true);
    setStatus({ msg: reduceMore ? 'Regenerando más corto…' : 'Pensando, seleccionando experiencia relevante y redactando… (15-30s)', type: 'loading' });

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobOffer, lang: targetLang, reduceMore }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setCvHtml(data.html);
      setStatus({ msg: '✓ CV generado. Revísalo y pulsa "Imprimir / Guardar PDF".', type: 'success' });
    } catch (e: any) {
      setStatus({ msg: '✗ ' + (e.message || 'Error'), type: 'error' });
    } finally {
      setGenerating(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  function handlePrint() { window.print(); }

  function handleClear() {
    setJobOffer('');
    setCvHtml('');
    setStatus(null);
  }

  const cvLen = masterCv.trim().length;
  const isCvSaved = masterCv === savedCv;
  let cvBadge: { text: string; cls: string };
  if (cvLen === 0) cvBadge = { text: 'vacío', cls: '' };
  else if (cvLen < 200) cvBadge = { text: 'incompleto', cls: 'warn' };
  else if (!isCvSaved) cvBadge = { text: 'guardando…', cls: '' };
  else cvBadge = { text: `${cvLen} caracteres ✓`, cls: 'ok' };

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Generador de CV</h1>
        <p className="subtitle">Adapta tu CV a cada oferta automáticamente</p>

        <div className="section">
          <div className="section-label">
            <span>Tu CV maestro</span>
            <span className={`badge ${cvBadge.cls}`}>{cvBadge.text}</span>
          </div>
          <textarea
            className="large"
            value={masterCv}
            onChange={e => setMasterCv(e.target.value)}
            placeholder="Pega aquí TODA tu información sin filtrar: nombre, contacto, experiencia, estudios, skills, proyectos, idiomas... Cuanto más completo, mejor."
          />
          <p className="help">Se guarda automáticamente en la nube. Solo lo pegas una vez.</p>
        </div>

        <div className="section">
          <div className="section-label"><span>Oferta de trabajo</span></div>
          <textarea
            className="large"
            value={jobOffer}
            onChange={e => setJobOffer(e.target.value)}
            placeholder="Pega aquí la descripción completa de la oferta: puesto, empresa, requisitos, responsabilidades..."
          />
        </div>

        <div className="section">
          <div className="section-label"><span>Idioma del CV</span></div>
          <input
            type="text"
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
            placeholder="ej: español, inglés"
          />
        </div>

        <button className="btn-primary" onClick={() => handleGenerate()} disabled={generating}>
          {generating ? 'Generando…' : 'Generar CV personalizado'}
        </button>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button className="btn-ghost" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="main">
        <div className="toolbar">
          <button className="btn-secondary" onClick={handlePrint}>Imprimir / Guardar PDF</button>
          {cvHtml && (
            <button className="btn-secondary" onClick={() => handleGenerate(true)} disabled={generating}>
              {generating ? 'Regenerando…' : 'Regenerar más corto'}
            </button>
          )}
          <button className="btn-secondary" onClick={handleClear}>Limpiar</button>
        </div>

        {status && <div className={`status ${status.type}`}>{status.msg}</div>}

        <div className="cv-wrap">
          {cvHtml ? (
            <div dangerouslySetInnerHTML={{ __html: cvHtml }} />
          ) : (
            <div className="cv-empty">
              <h2>Tu CV aparecerá aquí</h2>
              <p>Asegúrate de tener tu CV maestro guardado, pega una oferta y pulsa <strong>Generar CV personalizado</strong>.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
