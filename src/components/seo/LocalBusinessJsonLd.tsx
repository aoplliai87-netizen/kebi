import type { LocalBusiness, WithContext } from "schema-dts";

import { SITE_OG_IMAGE_PATH, SITE_URL, absoluteUrl } from "@/lib/seo";

function buildSchema(locale: string): WithContext<LocalBusiness> {
  const nameKo = "깨비콜밴";
  const nameEn = "Kkebi Private Van";
  const nameJa = "Kkebi 空港送迎";
  const nameZh = "Kkebi 机场接送";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    additionalType: "https://schema.org/TaxiService",
    name: locale === "ko" ? nameKo : locale === "ja" ? nameJa : locale === "zh" ? nameZh : nameEn,
    alternateName: locale === "ko" ? nameEn : nameKo,
    description:
      locale === "ko"
        ? "인천공항 전문 프리미엄 콜밴(공항 픽업·샌딩) 예약 및 상담."
        : locale === "ja"
          ? "仁川空港・金浦空港の空港送迎、ジャンボタクシー、貸切バンサービス。"
          : locale === "zh"
            ? "提供仁川机场与金浦机场接送、首尔包车与韩国旅游包车服务。"
            : "Premium private van service for Incheon Airport pickups and drop-offs.",
    url: SITE_URL,
    image: absoluteUrl(SITE_OG_IMAGE_PATH),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
    },
    areaServed: [
      { "@type": "City", name: "Incheon" },
      { "@type": "AdministrativeArea", name: "Seoul" },
      { "@type": "AdministrativeArea", name: "Gyeonggi Province" },
      { "@type": "Country", name: "South Korea" },
    ],
    telephone: "+82-10-4135-7621",
  };
}

/**
 * 구글 검색용 LocalBusiness + TaxiService(JSON-LD).
 * layout에서 한 번만 삽입합니다.
 */
export function LocalBusinessJsonLd({ locale }: { locale: string }) {
  const schema = buildSchema(locale);
  const json = JSON.stringify(schema);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
