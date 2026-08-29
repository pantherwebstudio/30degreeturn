import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '30° Turn Cafe | Artisanal Coffee & Brews',
  description: 'Welcome to 30° Turn Cafe. Savor our carefully curated, artisanal coffees, premium matcha, and fresh pastries in a warm, aesthetic atmosphere.',
  keywords: ['30 degree turn cafe', 'cafe', 'coffee shop', 'artisanal coffee', 'matcha', 'pastries', 'order coffee online'],
  openGraph: {
    title: '30° Turn Cafe | Artisanal Coffee & Brews',
    description: 'Welcome to 30° Turn Cafe. Savor our carefully curated, artisanal coffees, premium matcha, and fresh pastries.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
