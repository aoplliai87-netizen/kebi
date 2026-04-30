import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

import { SITE_URL } from "@/lib/seo";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

/** canonical·OG 상대 경로 해석 기준 — 언어별 세부 메타는 `[locale]` 페이지에서 설정합니다 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={montserrat.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
