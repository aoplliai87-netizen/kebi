import type { LocaleKey, LocalizedText } from "@/lib/site-settings-store";

export const SEO_PAGE_KEYS = [
  "home",
  "intro",
  "vehicle",
  "pricing",
  "booking",
  "review",
  "inquiry",
  "destinations",
] as const;

export type ManagedSeoPageKey = (typeof SEO_PAGE_KEYS)[number];

export type SeoPageSettings = {
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  ogTitle: LocalizedText;
  ogDescription: LocalizedText;
  ogImage: string;
  canonicalUrl: LocalizedText;
  focusKeywords: LocalizedText;
  searchAssistNotes: LocalizedText;
};

export type SeoPagesSettings = Record<ManagedSeoPageKey, SeoPageSettings>;

function emptyLocalized(): LocalizedText {
  return { ko: "", en: "", ja: "", zh: "" };
}

export function emptySeoPageSettings(): SeoPageSettings {
  return {
    metaTitle: emptyLocalized(),
    metaDescription: emptyLocalized(),
    ogTitle: emptyLocalized(),
    ogDescription: emptyLocalized(),
    ogImage: "",
    canonicalUrl: emptyLocalized(),
    focusKeywords: emptyLocalized(),
    searchAssistNotes: emptyLocalized(),
  };
}

export function emptySeoPagesSettings(): SeoPagesSettings {
  return SEO_PAGE_KEYS.reduce((acc, key) => {
    acc[key] = emptySeoPageSettings();
    return acc;
  }, {} as SeoPagesSettings);
}

function parseLocalized(value: unknown): LocalizedText {
  const v = value && typeof value === "object" ? (value as Partial<LocalizedText>) : {};
  return {
    ko: typeof v.ko === "string" ? v.ko.trim() : "",
    en: typeof v.en === "string" ? v.en.trim() : "",
    ja: typeof v.ja === "string" ? v.ja.trim() : "",
    zh: typeof v.zh === "string" ? v.zh.trim() : "",
  };
}

function parsePage(value: unknown): SeoPageSettings {
  const v = value && typeof value === "object" ? (value as Partial<SeoPageSettings>) : {};
  return {
    metaTitle: parseLocalized(v.metaTitle),
    metaDescription: parseLocalized(v.metaDescription),
    ogTitle: parseLocalized(v.ogTitle),
    ogDescription: parseLocalized(v.ogDescription),
    ogImage: typeof v.ogImage === "string" ? v.ogImage.trim() : "",
    canonicalUrl: parseLocalized(v.canonicalUrl),
    focusKeywords: parseLocalized(v.focusKeywords),
    searchAssistNotes: parseLocalized(v.searchAssistNotes),
  };
}

export function parseSeoPagesSettings(value: unknown): SeoPagesSettings {
  const src = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const out = emptySeoPagesSettings();
  for (const key of SEO_PAGE_KEYS) {
    out[key] = parsePage(src[key]);
  }
  return out;
}

/** slug → SEO (destination 랜딩 등 동적 키) */
export function parseSeoPerSlugMap(value: unknown): Record<string, SeoPageSettings> {
  if (!value || typeof value !== "object") return {};
  const src = value as Record<string, unknown>;
  const out: Record<string, SeoPageSettings> = {};
  for (const slug of Object.keys(src)) {
    out[slug] = parsePage(src[slug]);
  }
  return out;
}

export function pickLocaleText(value: LocalizedText, locale: LocaleKey): string {
  return value[locale]?.trim() || "";
}

export function parseKeywordsInput(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n|,/g)
    .map((v) => v.trim())
    .filter(Boolean);
}
