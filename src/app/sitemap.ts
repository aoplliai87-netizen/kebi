import type { MetadataRoute } from "next";

import { getAllDestinationSlugs } from "../../data/landing-pages";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

const ROUTES = [
  "",
  "intro",
  "vehicle",
  "pricing",
  "booking",
  "review",
  "inquiry",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of ROUTES) {
      const path = route ? `${locale}/${route}` : locale;
      const url = `${base}/${path}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.85,
      });
    }
    for (const slug of getAllDestinationSlugs()) {
      entries.push({
        url: `${base}/${locale}/destinations/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
