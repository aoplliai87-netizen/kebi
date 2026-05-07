import { SITE_OG_IMAGE_PATH, SITE_URL, absoluteUrl } from "@/lib/seo";

type Props = {
  name: string;
  description: string;
  pageUrl: string;
  areaServedNames: string[];
};

/** 랜딩 URL·서비스 지역이 본문과 일치하는 LocalBusiness 스키마 (레이아웃의 TaxiService 와 병행) */
export function DestinationLocalBusinessJsonLd({
  name,
  description,
  pageUrl,
  areaServedNames,
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url: pageUrl,
    image: absoluteUrl(SITE_OG_IMAGE_PATH),
    telephone: "+82-10-4135-7621",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressRegion: "Gyeonggi-do",
    },
    areaServed: areaServedNames.map((n) => ({ "@type": "Place", name: n })),
    parentOrganization: {
      "@type": "Organization",
      name: "Kkebi Private Van",
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
