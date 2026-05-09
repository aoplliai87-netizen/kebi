import type { LocaleKey, LocalizedText } from "@/lib/site-settings-store";

/** 관리자 편집으로 랜딩 데이터 파일을 덮어쓸 때 사용하는 슬롯(비어 있으면 데이터 파일 기본값) */
export type DestinationContentOverride = {
  h1?: LocalizedText;
  lede?: LocalizedText;
  vehicleRecommendBlurb?: LocalizedText;
  travelTraitsLine?: LocalizedText;
  sectionServiceBody?: LocalizedText;
  sectionCoverageBody?: LocalizedText;
  sectionWhyBody?: LocalizedText;
  /** 최대 5쌍, 인덱스별로 기본 FAQ를 대체 */
  faq?: Array<{ q: LocalizedText; a: LocalizedText }>;
  primaryCtaLabel?: LocalizedText;
  secondaryCtaLabel?: LocalizedText;
  pricingIntro?: LocalizedText;
  /** hero.src 대체(비어 있으면 기본 이미지) */
  heroImageSrc?: string;
  heroImageAlt?: LocalizedText;
};

export type DestinationContentOverrideMap = Record<string, DestinationContentOverride>;

const EMPTY: LocalizedText = { ko: "", en: "", ja: "", zh: "" };

function lt(v: unknown): LocalizedText {
  if (!v || typeof v !== "object") return { ...EMPTY };
  const o = v as Partial<LocalizedText>;
  return {
    ko: typeof o.ko === "string" ? o.ko : "",
    en: typeof o.en === "string" ? o.en : "",
    ja: typeof o.ja === "string" ? o.ja : "",
    zh: typeof o.zh === "string" ? o.zh : "",
  };
}

function parseFaq(v: unknown): DestinationContentOverride["faq"] {
  if (!Array.isArray(v)) return undefined;
  return v.map((row) => {
    if (!row || typeof row !== "object") return { q: { ...EMPTY }, a: { ...EMPTY } };
    const o = row as { q?: unknown; a?: unknown };
    return { q: lt(o.q), a: lt(o.a) };
  });
}

export function parseDestinationContentOverrideMap(value: unknown): DestinationContentOverrideMap {
  if (!value || typeof value !== "object") return {};
  const src = value as Record<string, unknown>;
  const out: DestinationContentOverrideMap = {};
  for (const slug of Object.keys(src)) {
    const raw = src[slug];
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    out[slug] = {
      h1: o.h1 !== undefined ? lt(o.h1) : undefined,
      lede: o.lede !== undefined ? lt(o.lede) : undefined,
      vehicleRecommendBlurb: o.vehicleRecommendBlurb !== undefined ? lt(o.vehicleRecommendBlurb) : undefined,
      travelTraitsLine: o.travelTraitsLine !== undefined ? lt(o.travelTraitsLine) : undefined,
      sectionServiceBody: o.sectionServiceBody !== undefined ? lt(o.sectionServiceBody) : undefined,
      sectionCoverageBody: o.sectionCoverageBody !== undefined ? lt(o.sectionCoverageBody) : undefined,
      sectionWhyBody: o.sectionWhyBody !== undefined ? lt(o.sectionWhyBody) : undefined,
      faq: parseFaq(o.faq),
      primaryCtaLabel: o.primaryCtaLabel !== undefined ? lt(o.primaryCtaLabel) : undefined,
      secondaryCtaLabel: o.secondaryCtaLabel !== undefined ? lt(o.secondaryCtaLabel) : undefined,
      pricingIntro: o.pricingIntro !== undefined ? lt(o.pricingIntro) : undefined,
      heroImageSrc: typeof o.heroImageSrc === "string" ? o.heroImageSrc.trim() : undefined,
      heroImageAlt: o.heroImageAlt !== undefined ? lt(o.heroImageAlt) : undefined,
    };
  }
  return out;
}

export function pickOverrideText(t: LocalizedText | undefined, locale: LocaleKey): string {
  if (!t) return "";
  return t[locale]?.trim() || t.ko?.trim() || t.en?.trim() || t.ja?.trim() || t.zh?.trim() || "";
}
