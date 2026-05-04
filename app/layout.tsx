import type { Metadata, Viewport } from 'next';
import { Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Queston · 비교과 AI 튜터',
  description: '교과를 넘어, 생기부의 새로운 표준으로. 영어·수학 학습 데이터로 탐구주제·도서·세특을 추천하는 AI 비교과 도우미.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Queston',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="%230E1116"/><text x="16" y="22" text-anchor="middle" font-family="serif" font-style="italic" font-size="18" fill="%23FF5722">q</text></svg>',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0E1116',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${fraunces.variable} ${jetbrains.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <style>{`
          :root {
            --font-pretendard: 'Pretendard Variable', Pretendard, sans-serif;
          }
          html, body { font-family: var(--font-pretendard); }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
