import type { Metadata } from 'next';
import '../styles/main.css';

export const metadata: Metadata = {
  title: 'Fútbol en la Piel | Camisetas Retro, de Colección y Actuales',
  description:
    'Tienda uruguaya de camisetas retro, de colección y actuales con stock real disponible, talles verificados y compra directa por WhatsApp con envíos a todo el país.',
  openGraph: {
    title: 'Fútbol en la Piel | Camisetas Retro, de Colección y Actuales',
    description:
      'Tienda uruguaya de camisetas retro, de colección y actuales con stock real disponible, talles verificados y compra directa por WhatsApp con envíos a todo el país.',
    locale: 'es_UY',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/logos/futbol_logo_mejorado_v2.png',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
