import type { Metadata } from 'next';
import { Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google';
import '../styles/main.css';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

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
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
