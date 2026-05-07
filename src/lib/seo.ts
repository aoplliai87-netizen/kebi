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

function buildKeywords(locale: string, page: SeoPageKey): string[] {
  const globalKo = [
    "인천공항 콜밴",
    "김포공항 콜밴",
    "공항픽업",
    "공항샌딩",
    "콜밴 예약",
    "웨딩 차량",
    "투어 차량",
  ];
  const globalEn = [
    "Private Van Service",
    "Airport Shuttle",
    "Minivan Taxi",
    "Incheon Airport Transfer",
    "Gimpo Airport Transfer",
    "Airport Pickup",
    "Airport Dropoff",
  ];
  const homeKo = ["의정부 인천공항 콜밴", "서울 인천공항 밴택시", "공항 의전 서비스"];
  const homeEn = ["Seoul Airport Shuttle", "Korea Minivan Taxi", "Premium airport van"];
  const globalJa = [
    "空港送迎",
    "インチョン空港 送迎",
    "ジャンボタクシー",
    "韓国 空港送迎",
    "貸切バン",
  ];
  const homeJa = ["仁川空港 送迎", "ソウル 空港送迎", "韓国 ジャンボタクシー"];
  const globalZh = [
    "机场接送",
    "仁川机场接送",
    "首尔包车",
    "韩国旅游包车",
    "商务包车",
  ];
  const homeZh = ["韩国机场接送", "首尔机场接送", "仁川机场包车"];

  const base =
    locale === "ko"
      ? globalKo
      : locale === "ja"
        ? globalJa
        : locale === "zh"
          ? globalZh
          : globalEn;
  if (page === "home") {
    return [
      ...base,
      ...(locale === "ko" ? homeKo : locale === "ja" ? homeJa : locale === "zh" ? homeZh : homeEn),
    ];
  }
  return base;
}

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
  const ogLocaleMap: Record<string, string> = {
    ko: "ko_KR",
    en: "en_US",
    ja: "ja_JP",
    zh: "zh_CN",
  };
  const ogLocale = ogLocaleMap[locale] ?? "en_US";
  const alternateOgLocale = Object.values(ogLocaleMap).filter((v) => v !== ogLocale);
  const locales = ["ko", "en", "ja", "zh"] as const;
  const languages = Object.fromEntries(
    locales.map((loc) => [loc, absoluteUrl(localizedPath(loc, page))])
  ) as Record<string, string>;

  const naverVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;
  const baiduVerification = process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION;
  const otherVerification =
    naverVerification || baiduVerification
      ? {
          ...(naverVerification ? { "naver-site-verification": naverVerification } : {}),
          ...(baiduVerification ? { "baidu-site-verification": baiduVerification } : {}),
        }
      : undefined;

  return {
    title,
    description,
    keywords: buildKeywords(locale, page),
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": absoluteUrl(localizedPath("ko", page)),
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName,
      locale: ogLocale,
      alternateLocale: alternateOgLocale,
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
    other: {
      ...(otherVerification ?? {}),
      "format-detection": "telephone=no",
    },
  };
}

const OG_LOCALE_MAP: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

const HREFLANG_LOCALES = ["ko", "en", "ja", "zh"] as const;

/**
 * `/[locale]/destinations/[slug]` 전용 — hreflang·canonical·OG 패턴은 buildPageMetadata 와 동일
 */
export function buildDestinationMetadata(opts: {
  locale: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  siteName: string;
}): Metadata {
  const { locale, slug, title, description, keywords, siteName } = opts;
  const pathFor = (loc: string) => `/${loc}/destinations/${slug}`;
  const canonical = absoluteUrl(pathFor(locale));
  const ogImage = absoluteUrl(SITE_OG_IMAGE_PATH);
  const ogLocale = OG_LOCALE_MAP[locale] ?? "en_US";
  const alternateOgLocale = Object.values(OG_LOCALE_MAP).filter((v) => v !== ogLocale);
  const languages = Object.fromEntries(
    HREFLANG_LOCALES.map((loc) => [loc, absoluteUrl(pathFor(loc))]),
  ) as Record<string, string>;

  const naverVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;
  const baiduVerification = process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION;
  const otherVerification =
    naverVerification || baiduVerification
      ? {
          ...(naverVerification ? { "naver-site-verification": naverVerification } : {}),
          ...(baiduVerification ? { "baidu-site-verification": baiduVerification } : {}),
        }
      : undefined;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": absoluteUrl(pathFor("ko")),
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName,
      locale: ogLocale,
      alternateLocale: alternateOgLocale,
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
    other: {
      ...(otherVerification ?? {}),
      "format-detection": "telephone=no",
    },
  };
}
