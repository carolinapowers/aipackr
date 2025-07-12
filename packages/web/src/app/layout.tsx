import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIPackr - AI-Powered Travel Packing Assistant',
  description: 'Pack smarter with AI-powered recommendations for your travels',
  keywords: ['travel', 'packing', 'AI', 'assistant', 'luggage', 'clothing'],
  authors: [{ name: 'AIPackr Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root" className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}