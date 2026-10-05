import type { Metadata } from "next";
import "./globals.css";
import {SITE_ORIGIN} from "../lib/site";

export const metadata: Metadata = {
  title: "허브스튜디오3 | 이미지로 만드는 전자책·SNS·기사",
  description: "이미지 허브의 사진으로 전문 전자책, 4종 SNS 피드, 기사를 제작하고 검수·발행하는 편집 작업실.",
  metadataBase: new URL(SITE_ORIGIN),
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined, other: process.env.NAVER_SITE_VERIFICATION ? {'naver-site-verification': process.env.NAVER_SITE_VERIFICATION} : {} },
  alternates: {types: {'application/rss+xml': '/rss.xml'}},
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
