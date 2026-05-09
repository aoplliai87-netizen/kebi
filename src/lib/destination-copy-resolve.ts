import {
  getCopyForLocale,
  getLandingPageBySlug,
  type LandingPageCopy,
} from "../../data/landing-pages";
import { enrichDestinationCopy } from "@/lib/destination-enrichment";
import { mergeDestinationPoiCopy } from "@/lib/destination-poi-merge";
import { pickLocalized } from "@/lib/home-sections";
import type { LocaleKey, LocalizedText, SiteSettings } from "@/lib/site-settings-store";

function mergeLt(ov: LocalizedText | undefined, baseStr: string, locale: LocaleKey): string {
  if (!ov) return baseStr;
  const t = pickLocalized(ov, locale);
  return t.trim() ? t : baseStr;
}

/** 데이터 파일 기본값 + 관리자 오버라이드 병합 */
export function resolveDestinationLandingCopy(
  slug: string,
  locale: string,
  settings: Pick<SiteSettings, "destinationContentOverrides">,
): LandingPageCopy | null {
  const landing = getLandingPageBySlug(slug);
  if (!landing) return null;
  const loc = locale as LocaleKey;
  const base = getCopyForLocale(landing, locale);
  const o = settings.destinationContentOverrides[slug];
  if (!o) {
    return mergeDestinationPoiCopy(enrichDestinationCopy(base, slug, locale, landing.seoPlaceHints), slug, locale);
  }

  const sections = base.sections.map((sec, idx) => {
    const bodyOv =
      idx === 0 ? o.sectionServiceBody : idx === 1 ? o.sectionCoverageBody : idx === 2 ? o.sectionWhyBody : undefined;
    const nextBody = mergeLt(bodyOv, sec.body, loc);
    return { ...sec, body: nextBody };
  });

  const faq = base.faq.map((item, idx) => {
    const pair = o.faq?.[idx];
    if (!pair) return item;
    return {
      q: mergeLt(pair.q, item.q, loc),
      a: mergeLt(pair.a, item.a, loc),
    };
  });

  const heroSrc = o.heroImageSrc?.trim() || base.hero.src;
  const heroAlt = mergeLt(o.heroImageAlt, base.hero.alt, loc);

  const merged: LandingPageCopy = {
    ...base,
    h1: mergeLt(o.h1, base.h1, loc),
    lede: mergeLt(o.lede, base.lede, loc),
    vehicleRecommendBlurb:
      o.vehicleRecommendBlurb !== undefined
        ? mergeLt(o.vehicleRecommendBlurb, base.vehicleRecommendBlurb ?? "", loc) || base.vehicleRecommendBlurb
        : base.vehicleRecommendBlurb,
    travelTraitsLine:
      o.travelTraitsLine !== undefined
        ? mergeLt(o.travelTraitsLine, base.travelTraitsLine ?? "", loc) || base.travelTraitsLine
        : base.travelTraitsLine,
    sections,
    faq,
    primaryCtaLabel: mergeLt(o.primaryCtaLabel, base.primaryCtaLabel, loc),
    secondaryCtaLabel: mergeLt(o.secondaryCtaLabel, base.secondaryCtaLabel, loc),
    pricingIntro: mergeLt(o.pricingIntro, base.pricingIntro, loc),
    hero: {
      ...base.hero,
      src: heroSrc,
      alt: heroAlt,
    },
  };
  return mergeDestinationPoiCopy(enrichDestinationCopy(merged, slug, locale, landing.seoPlaceHints), slug, locale);
}
