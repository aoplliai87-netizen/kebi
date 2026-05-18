import { getBrandSameAsLinks } from "@/lib/brand-external-links";
import { SITE_OG_IMAGE_PATH, SITE_URL, absoluteUrl } from "@/lib/seo";

const NAMES: Record<string, string> = {
  ko: "깨비콜밴",
  en: "Kkebi Private Van",
  ja: "Kkebi 空港送迎 ジャンボタクシー",
  zh: "Kkebi 机场接送包车",
};

const DESCRIPTIONS: Record<string, string> = {
  ko: "인천공항·김포공항 전문 픽업·샌딩, 서울·경기 전역 24시간 운행. 외국어 응대 가능.",
  en: "24/7 Incheon/Gimpo airport transfer, private van and jumbo taxi service across Seoul & Gyeonggi. Multilingual support.",
  ja: "仁川空港・金浦空港からソウル・京畿道まで24時間ジャンボタクシー・貸切送迎。日本語対応可能。",
  zh: "提供仁川/金浦机场接送及首尔、京畿道全境包车服务。24小时运营，支持中文沟通。",
};

function buildSchema(locale: string): Record<string, unknown> {
  const lang = locale in NAMES ? locale : "en";
  return {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: NAMES[lang],
    alternateName: lang === "ko" ? NAMES["en"] : NAMES["ko"],
    description: DESCRIPTIONS[lang],
    url: SITE_URL,
    image: absoluteUrl(SITE_OG_IMAGE_PATH),
    priceRange: "$$",
    telephone: "+82-10-4135-7621",
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressRegion: "Gyeonggi-do",
    },
    areaServed: [
      { "@type": "Place", name: "Incheon International Airport" },
      { "@type": "Place", name: "Gimpo International Airport" },
      { "@type": "City", name: "Seoul" },
      { "@type": "AdministrativeArea", name: "Gyeonggi Province" },
      { "@type": "Country", name: "South Korea" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    ...(getBrandSameAsLinks().length > 0 ? { sameAs: getBrandSameAsLinks() } : {}),
  };
}

export function LocalBusinessJsonLd({ locale }: { locale: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema(locale)) }}
    />
  );
}
