import type { Metadata } from "next";

/** 프로덕션 도메인 — 메타 canonical·OG·robots·사이트맵 기준 */
export const SITE_URL = "https://kebicallvan.com";
export const SITE_OG_IMAGE_PATH = "/images/og-image.jpg";

export type SeoPageKey =
  | "home"
  | "intro"
  | "vehicle"
  | "pricing"
  | "booking"
  | "review"
  | "inquiry"
  | "support";

const pathSegment: Record<SeoPageKey, string> = {
  home: "",
  intro: "intro",
  vehicle: "vehicle",
  pricing: "pricing",
  booking: "booking",
  review: "review",
  inquiry: "inquiry",
  support: "support",
};

export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

function localizedPath(locale: string, page: SeoPageKey): string {
  const tail = pathSegment[page];
  return tail ? `/${locale}/${tail}` : `/${locale}`;
}

/**
 * 페이지별 canonical·hreflang·OG·Twitter 메타데이터 (다국어 공통 패턴)
 */
export function buildPageMetadata(opts: {
  locale: string;
  page: SeoPageKey;
  title: string;
  description: string;
  siteName: string;
}): Metadata {
  const { locale, page, title, description, siteName } = opts;
  const canonical = absoluteUrl(localizedPath(locale, page));
  const ogImage = absoluteUrl(SITE_OG_IMAGE_PATH);
  const ogLocale = locale === "ko" ? "ko_KR" : "en_US";
  const alternateOgLocale = locale === "ko" ? "en_US" : "ko_KR";

  const koPath = localizedPath("ko", page);
  const enPath = localizedPath("en", page);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ko: absoluteUrl(koPath),
        en: absoluteUrl(enPath),
        "x-default": absoluteUrl(koPath),
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName,
      locale: ogLocale,
      alternateLocale: [alternateOgLocale],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}
