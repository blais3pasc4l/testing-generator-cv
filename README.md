# Generador de CV

Mini-app personal para generar CVs personalizados por oferta usando Claude.

## Qué es

- **Login con contraseña única** (variable de entorno)
- **CV maestro guardado en la nube** (Upstash Redis vía Vercel)
- **API key de Anthropic en el servidor** (nunca expuesta al navegador)
- **Diseño limpio, exporta a PDF con Ctrl/Cmd+P**

---

## Despliegue en Vercel (paso a paso)

### 1. Subir el código a GitHub

Abre una terminal dentro de la carpeta `cv-generator` (donde está este README):

```bash
git init
git add .
git commit -m "primer commit"
```

Ve a GitHub y crea un repositorio nuevo **vacío** (sin README, sin .gitignore — los ya tienes). Cópialo y conéctalo:

```bash
git remote add origin https://github.com/TU-USUARIO/cv-generator.git
git branch -M main
git push -u origin main
```

### 2. Crear el proyecto en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repo `cv-generator`
3. **No hagas deploy todavía** — primero hay que añadir las variables de entorno
4. En "Environment Variables", añade estas tres:

| Nombre | Valor |
|---|---|
| `APP_PASSWORD` | La contraseña que usarás para entrar (elige una larga y única) |
| `SESSION_SECRET` | Una cadena aleatoria larga. Generala con `openssl rand -base64 32` o cualquier generador online |
| `ANTHROPIC_API_KEY` | Tu API key de [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |

5. Pulsa **Deploy**. Espera 1-2 minutos.

### 3. Conectar Upstash Redis

Tras el primer deploy:

1. En el dashboard de tu proyecto en Vercel, ve a la pestaña **Storage**
2. Click en **Create Database** → busca **Upstash** → selecciona **Redis** (plan gratuito)
3. Acepta el flujo (te pedirá conectar Upstash, plan gratis tiene 10k comandos/día — sobra mucho)
4. Cuando termine, asegúrate de que esté **conectado a este proyecto** (Connect Project)
5. Vercel inyectará automáticamente `KV_REST_API_URL` y `KV_REST_API_TOKEN`
6. Ve a **Deployments** y dispara un redeploy (o haz cualquier push a GitHub) para que la app vea las nuevas variables

### 4. Listo

Abre tu dominio `*.vercel.app`, introduce tu contraseña, pega tu CV maestro (solo la primera vez) y empieza a generar CVs.

---

## Desarrollo local (opcional)

Si quieres probarlo en tu máquina antes de subir:

```bash
npm install
cp .env.local.example .env.local
# Edita .env.local con tus valores (la parte de Upstash puede quedar vacía hasta que tengas algo en Vercel)
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Para usar Upstash en local, copia las dos variables `KV_REST_API_URL` y `KV_REST_API_TOKEN` desde el dashboard de Vercel (Settings → Environment Variables) a tu `.env.local`.

---

## Estructura del proyecto

```
cv-generator/
├── app/
│   ├── api/
│   │   ├── auth/login/route.ts    # POST: validar contraseña, crear cookie
│   │   ├── auth/logout/route.ts   # POST: borrar cookie
│   │   ├── cv/route.ts            # GET/PUT: leer/guardar CV maestro
│   │   └── generate/route.ts      # POST: llamar a Claude
│   ├── login/page.tsx             # página /login
│   ├── page.tsx                   # / (verifica auth, redirige si no)
│   ├── Generator.tsx              # componente principal de la UI
│   ├── layout.tsx                 # root layout
│   └── globals.css                # estilos
├── lib/
│   ├── session.ts                 # JWT en cookie httpOnly
│   ├── redis.ts                   # cliente Upstash
│   └── prompt.ts                  # plantilla del prompt para Claude
├── package.json
├── tsconfig.json
├── next.config.js
├── .env.local.example
└── .gitignore
```

---

## Personalización

**Cambiar el diseño del CV**: edita las clases `.cv-*` en `app/globals.css`.

**Cambiar el modelo**: en `app/api/generate/route.ts`, línea `model: 'claude-sonnet-4-5'`. Otras opciones: `'claude-opus-4-7'` (más caro, mejor calidad), `'claude-haiku-4-5-20251001'` (más barato, rápido).

**Cambiar la estructura del CV** (añadir/quitar secciones, p.ej. foto, proyectos): edita la plantilla del prompt en `lib/prompt.ts` y los estilos correspondientes en `globals.css`.

---

## Costes esperados

- **Vercel**: gratis en plan Hobby para uso personal
- **Upstash Redis**: gratis hasta 10k comandos/día (esta app usa ~2 por sesión)
- **API de Anthropic**: ~$0.01-0.03 por CV generado con Sonnet 4.5

Total realista: **céntimos al mes** salvo que generes cientos de CVs.
