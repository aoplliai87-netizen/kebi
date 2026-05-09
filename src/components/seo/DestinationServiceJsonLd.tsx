import { SITE_URL, absoluteUrl } from "@/lib/seo";

type Props = {
  name: string;
  description: string;
  pageUrl: string;
  /** 서비스 제공 지역명 (랜딩 본문과 맞출 것) */
  areaServedNames: string[];
  providerName: string;
};

/**
 * 랜딩별 1개 Service JSON-LD — FAQPage·LocalBusiness·Breadcrumb과 중복 최소화
 * @see https://schema.org/Service
 */
export function DestinationServiceJsonLd({
  name,
  description,
  pageUrl,
  areaServedNames,
  providerName,
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Airport shuttle / private van transfer",
    name,
    description,
    url: pageUrl,
    areaServed: areaServedNames.map((n) => ({ "@type": "Place", name: n })),
    provider: {
      "@type": "LocalBusiness",
      name: providerName,
      url: SITE_URL,
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl("/ko/booking"),
      availableLanguage: ["Korean", "English", "Japanese", "Chinese"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
