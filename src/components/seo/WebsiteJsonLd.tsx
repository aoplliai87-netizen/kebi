import type { WebSite, WithContext } from "schema-dts";
import { SITE_URL } from "@/lib/seo";

export function WebsiteJsonLd({ locale }: { locale: string }) {
  const name = locale === "ko" ? "깨비콜밴" : "Kkebi Private Van";
  const schema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: SITE_URL,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
