import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'CREDX USA - Smart Financial Management & Credit Optimization',
  description: 'AI-powered bill management, credit score optimization, and rewards earning platform. Manage your finances smarter with CREDX USA.',
  keywords: 'credit score, bill management, financial advisor, AI finance, rewards, autopay, credit cards',
  authors: [{ name: 'CREDX USA' }],
  creator: 'CREDX USA',
  publisher: 'CREDX USA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://credxusa.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CREDX USA - Smart Financial Management',
    description: 'AI-powered platform for managing bills, optimizing credit scores, and earning rewards. Join 50,000+ Americans building better financial futures.',
    url: 'https://credxusa.com',
    siteName: 'CREDX USA',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CREDX USA - Smart Financial Management',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CREDX USA - Smart Financial Management',
    description: 'AI-powered bill management and credit optimization platform',
    images: ['/og-image.jpg'],
    creator: '@credxusa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ea580c" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}