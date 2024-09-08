import { Viewport } from 'next/types';
import { Inter } from 'next/font/google';
import { getMetadata } from '@/lib/util/getMetaData';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import Footer from './components/footer/Footer';

export const metadata = getMetadata();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'emotional',
  url: 'https://www.emotional.today/',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA = process.env.NEXT_PUBLIC_GA_ID as string;
  return (
    <html lang="ko">
      <head>
        <meta name="robots" content="index,follow" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icon-152x152.png"
          type="image/png"
        />
        <link rel="canonical" href="https://www.emotional.today/" />
      </head>
      <body className={inter.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        {children}
      </body>
      <Footer />
      <GoogleAnalytics gaId={GA} />
    </html>
  );
}
