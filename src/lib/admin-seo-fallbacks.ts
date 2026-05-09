import { getAllDestinationSlugs, getCopyForLocale, getLandingPageBySlug } from "../../data/landing-pages";
import { absoluteUrl } from "@/lib/seo";
import {
  SEO_PAGE_KEYS,
  type ManagedSeoPageKey,
  type SeoPagesSettings,
  type SeoPageSettings,
  emptySeoPageSettings,
  emptySeoPagesSettings,
} from "@/lib/seo-settings";
import type { LocaleKey } from "@/lib/site-settings-store";

const PAGE_TO_METADATA_KEY: Record<ManagedSeoPageKey, string> = {
  home: "home",
  intro: "intro",
  vehicle: "vehicle",
  pricing: "pricing",
  booking: "booking",
  review: "review",
  inquiry: "inquiry",
  destinations: "destinationsHub",
};

const PAGE_TO_PATH: Record<ManagedSeoPageKey, string> = {
  home: "",
  intro: "intro",
  vehicle: "vehicle",
  pricing: "pricing",
  booking: "booking",
  review: "review",
  inquiry: "inquiry",
  destinations: "destinations",
};

function getString(obj: unknown, path: string[]): string {
  let cur: unknown = obj;
  for (const key of path) {
    if (!cur || typeof cur !== "object") return "";
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === "string" ? cur.trim() : "";
}

export async function buildAdminSeoFallbacks(): Promise<SeoPagesSettings> {
  const locales: LocaleKey[] = ["ko", "en", "ja", "zh"];
  const localeJson = await Promise.all(
    locales.map(async (locale) => {
      const mod = await import(`../../messages/${locale}.json`);
      return mod.default as Record<string, unknown>;
    }),
  );
  const out = emptySeoPagesSettings();

  for (const page of SEO_PAGE_KEYS) {
    for (let i = 0; i < locales.length; i += 1) {
      const locale = locales[i];
      const raw = localeJson[i];
      const key = PAGE_TO_METADATA_KEY[page];
      const title = getString(raw, ["Metadata", "pages", key, "title"]);
      const desc = getString(raw, ["Metadata", "pages", key, "description"]);
      const canonicalTail = PAGE_TO_PATH[page];
      const canonical = canonicalTail
        ? absoluteUrl(`/${locale}/${canonicalTail}`)
        : absoluteUrl(`/${locale}`);
      out[page].metaTitle[locale] = title;
      out[page].metaDescription[locale] = desc;
      out[page].ogTitle[locale] = title;
      out[page].ogDescription[locale] = desc;
      out[page].canonicalUrl[locale] = canonical;
    }
  }

  return out;
}

/** `/[locale]/destinations/[slug]` SEO 폼 placeholder — 랜딩 데이터 파일 메타 기준 */
export function buildSeoFallbackForDestinationSlug(slug: string): SeoPageSettings {
  const page = getLandingPageBySlug(slug);
  const out = emptySeoPageSettings();
  if (!page) return out;
  const locales: LocaleKey[] = ["ko", "en", "ja", "zh"];
  for (const loc of locales) {
    const copy = getCopyForLocale(page, loc);
    out.metaTitle[loc] = copy.metaTitle;
    out.metaDescription[loc] = copy.metaDescription;
    out.ogTitle[loc] = copy.metaTitle;
    out.ogDescription[loc] = copy.metaDescription;
    out.canonicalUrl[loc] = absoluteUrl(`/${loc}/destinations/${slug}`);
    out.focusKeywords[loc] = copy.keywords.join(", ");
  }
  return out;
}

export function buildAllDestinationSlugSeoFallbacks(): Record<string, SeoPageSettings> {
  const out: Record<string, SeoPageSettings> = {};
  for (const slug of getAllDestinationSlugs()) {
    out[slug] = buildSeoFallbackForDestinationSlug(slug);
  }
  return out;
}
