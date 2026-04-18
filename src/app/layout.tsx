import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import "./globals.css";

/** 기본 메타 — locale별 세부값은 `[locale]/layout`에서 덮어씁니다 */
export const metadata: Metadata = {
  title: "깨비콜밴",
  description: "인천공항 전문 콜밴 예약 · 관리",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
