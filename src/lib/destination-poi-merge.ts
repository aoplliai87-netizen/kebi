/**
 * 목적지 POI 번들을 랜딩 카피에 합성 — 키워드 나열이 아닌 짧은 문맥 보강
 */
import type { DestinationPoiBundle, PoiQuad } from "../../data/destination-poi-bundles";
import { getPoiBundle } from "../../data/destination-poi-bundles";
import type { AppLocale, LandingPageCopy } from "../../data/landing-pages";

/** 로케일별: 현지 표기 + 영문 병기 (검색·신뢰용) */
function formatPoiLine(p: PoiQuad, locale: AppLocale): string {
  if (locale === "ko") return `${p.ko} (${p.en})`;
  if (locale === "en") return `${p.en} (${p.ko})`;
  if (locale === "ja") return `${p.ja} (${p.en})`;
  return `${p.zh} (${p.en})`;
}

function dedupeKeywords(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of items) {
    const t = x.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function appendIfFresh(base: string, addition: string, probeLen = 24): string {
  const t = addition.trim();
  if (!t) return base;
  if (base.includes(t.slice(0, Math.min(probeLen, t.length)))) return base;
  return `${base.trim()} ${t}`;
}

function applyBundle(copy: LandingPageCopy, bundle: DestinationPoiBundle, locale: AppLocale): LandingPageCopy {
  const boost = bundle.searchBoostKeywords[locale] ?? bundle.searchBoostKeywords.en ?? [];
  const keywords = dedupeKeywords([...copy.keywords, ...boost]).slice(0, 22);

  const accent = bundle.metaAccent[locale];
  const metaDescription = appendIfFresh(copy.metaDescription, accent);

  const bridge = bundle.ledeBridge[locale];
  const lede = bridge ? appendIfFresh(copy.lede, bridge, 20) : copy.lede;

  const destinationPoi = {
    nearbyHotels: bundle.hotels.map((h) => formatPoiLine(h, locale)),
    nearbyLandmarks: bundle.landmarks.map((l) => formatPoiLine(l, locale)),
    recommendedDropoff: bundle.recommendedDropoff[locale],
    popularDestinationTags: bundle.tags[locale],
  };

  return {
    ...copy,
    metaDescription,
    keywords,
    lede,
    destinationPoi,
  };
}

export function mergeDestinationPoiCopy(copy: LandingPageCopy, slug: string, locale: string): LandingPageCopy {
  const loc = locale as AppLocale;
  const bundle = getPoiBundle(slug);
  if (!bundle) return copy;
  return applyBundle(copy, bundle, loc);
}
