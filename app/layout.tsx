import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generador de CV',
  description: 'Genera CVs personalizados para cada oferta',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
