import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Claude Code UI - Modern AI Coding Assistant',
  description: 'A modern web interface for Claude Code CLI, Cursor CLI, and Codegen with real-time chat, file management, and AI-powered coding assistance.',
  keywords: ['claude', 'ai', 'coding', 'assistant', 'cursor', 'codegen', 'mcp'],
  authors: [{ name: 'Claude Code UI Team' }],
  creator: 'Claude Code UI',
  publisher: 'Claude Code UI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://claude-code-ui.vercel.app'),
  openGraph: {
    title: 'Claude Code UI - Modern AI Coding Assistant',
    description: 'A modern web interface for Claude Code CLI, Cursor CLI, and Codegen',
    url: 'https://claude-code-ui.vercel.app',
    siteName: 'Claude Code UI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Claude Code UI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claude Code UI - Modern AI Coding Assistant',
    description: 'A modern web interface for Claude Code CLI, Cursor CLI, and Codegen',
    images: ['/og-image.png'],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
