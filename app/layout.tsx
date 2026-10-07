import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '৪০ দিনের জাদু থেকে সুরক্ষা চ্যালেঞ্জ | SukunLife',
  description: 'SukunLife-এর সম্পূর্ণ ফ্রি ৪০ দিনের জাদু থেকে সুরক্ষা চ্যালেঞ্জ।',
  icons: {
    icon: 'https://www.sukunlife.com/_next/static/media/logo-big.93426c9f.png',
    shortcut: 'https://www.sukunlife.com/_next/static/media/logo-big.93426c9f.png',
    apple: 'https://www.sukunlife.com/_next/static/media/logo-big.93426c9f.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
