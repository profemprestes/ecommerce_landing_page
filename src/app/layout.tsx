import type { Metadata } from 'next';
import '../styles/main.css';

export const metadata: Metadata = {
  title: 'Material Flask',
  description:
    'Interactive product landing page for Material Flask featuring WebGL alpine contours, pinned 4K angle showcase, thermal comparison slider, and finish configurator.',
  openGraph: {
    title: 'Material Flask',
    description:
      'Interactive product landing page for Material Flask featuring WebGL alpine contours, pinned 4K angle showcase, thermal comparison slider, and finish configurator.',
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
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
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
