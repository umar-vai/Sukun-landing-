import type { Metadata } from 'next';
import './globals.css';

const GTM_ID = 'GTM-KPJPKF49';

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
