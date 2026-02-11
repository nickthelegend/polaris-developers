import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Polaris Payments | Developer Console',
  description: 'Deploy merchant escrow contracts and integrate Polaris BNPL.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-200`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
