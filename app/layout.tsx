import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GNB from "@/components/common/GNB";
import Footer from "@/components/common/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = "https://postop.co.kr";
const siteName = "포스탑";
const defaultTitle = "포스탑 | 산업 현장 안전 솔루션";
const defaultDescription = "산업 현장의 위험을 사전에 차단하는 시각·청각 경고 시스템 및 작업자 인식 기반 안전 설비를 공급합니다.";

export const viewport: Viewport = {
  themeColor: "#fcfeff",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,

  applicationName: siteName,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  // 검색엔진 노출/수집
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // 키워드는 영향이 작지만, B2B/제품군에서 보조로 넣을 수는 있음
  keywords: ["포스탑", "산업안전", "안전경고시스템", "시각경고", "청각경고", "경광등", "산업현장 안전", "작업자 안전", "안전설비", "안전 솔루션"],

  // OG (카톡/페북/링크 공유 썸네일)
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    locale: "ko_KR",
    images: [
      {
        url: "/og.png", // ✅ public/og.png로 넣어줘(1200x630 권장)
        width: 1200,
        height: 630,
        alt: `${siteName} 대표 이미지`,
      },
    ],
  },

  // 트위터 카드
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og.png"],
  },

  // 브랜드 아이콘
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  other: {
    "naver-site-verification": "97d1b915cfcb373c4cddbdb2b24eb57fef7a509e",
  },

  // 웹앱/모바일 설치
  manifest: "/site.webmanifest",

  // (선택) 회사 연락처/위치 등 신뢰 요소는 아래 JSON-LD로 별도 넣는 게 더 큼
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative bg-[#fcfeff]`}>
        <GNB />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
