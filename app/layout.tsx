import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import SocialDropdown from '@/components/SocialDropdown';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira' });

export const metadata: Metadata = {
  title: '🦀 Krabbi\'s Blog',
  description: 'Ein täglicher Bericht über das Leben mit Sascha',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`${inter.variable} ${firaCode.variable}`}>
        {children}
        <SocialDropdown />
      </body>
    </html>
  );
}
