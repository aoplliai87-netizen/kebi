/**
 * 지역→공항 랜딩 공통 빌더 (to-airport / 확장 랜딩 공유)
 */
import type { LandingPage, LandingPageCopy } from "./landing-pages";

type Loc = "ko" | "en" | "ja" | "zh";

export function heroBox(
  src: string,
  altKo: string,
  altEn: string,
): Record<Loc, LandingPageCopy["hero"]> {
  const b = { src, width: 1200, height: 750 };
  return {
    ko: { ...b, alt: altKo },
    en: { ...b, alt: altEn },
    ja: { ...b, alt: altEn },
    zh: { ...b, alt: altEn },
  };
}

export const H1 = heroBox(
  "/images/vehicles/staria-hero.png",
  "수도권 출발 인천공항 프라이빗 밴",
  "Private van to Incheon Airport from Seoul metro",
);
export const H2 = heroBox(
  "/images/vehicles/solati-hero.png",
  "대형 밴 인천공항 샌딩",
  "Large van drop-off at Incheon Airport",
);
export const H3 = heroBox(
  "/images/vehicles/county-hero.png",
  "짐 많은 가족·골프 인천공항 이동",
  "Family and golf gear airport run Korea",
);

export function sec(
  ko: [string, string, string],
  en: [string, string, string],
): { ko: LandingPageCopy["sections"]; en: LandingPageCopy["sections"] } {
  const hk = ["픽업·일정 안내", "구간·도로 특성", "이런 분께 추천"];
  const he = ["Pickup planning", "Route notes", "Best for"];
  const ids = ["service", "coverage", "why"] as const;
  return {
    ko: ids.map((id, i) => ({ id, heading: hk[i], body: ko[i] })),
    en: ids.map((id, i) => ({ id, heading: he[i], body: en[i] })),
  };
}

export function toAirportBase(hero: Record<Loc, LandingPageCopy["hero"]>): {
  ko: LandingPageCopy;
  en: LandingPageCopy;
} {
  const { ko: sKo, en: sEn } = sec(
    [
      "집·호텔·사무실 주소를 받아 픽업 시간을 제안합니다. 항공편 체크인 마감에 맞춰 역산해 출발 시각을 조정합니다.",
      "경부·영동·공항고속도로 등 구간별 혼잡도를 고려합니다. 서울 및 수도권 전역에서 인천공항 출국 동선을 상담합니다.",
      "출국 날 짐이 많거나 가족·단체 동반 시 프라이빗 밴이 유리합니다. 대중교통 환승 없이 공항까지 한 번에 이동합니다.",
    ],
    [
      "We confirm your pickup address and propose a departure time based on your flight’s check-in window.",
      "Routing considers highway traffic patterns toward ICN from Seoul and the surrounding metro area.",
      "Ideal when you want one direct ride with luggage—without subway stairs or train transfers.",
    ],
  );
  const ko: LandingPageCopy = {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    linkTitle: "",
    h1: "",
    lede: "",
    vehicleRecommendBlurb: "",
    travelTraitsLine: "",
    sections: sKo,
    pricingIntro:
      "픽업 주소·항공편 시간·유류·통행료를 반영해 정찰제로 안내합니다. 새벽·심야 요금은 예약 시 함께 확정합니다.",
    pricingItems: [
      { label: "출발지 → 인천공항", price: "구간별 정찰제", note: "통행료 포함 기준" },
      { label: "새벽·심야 픽업", price: "시간대별 추가 가능", note: "출국 스케줄 반영" },
      { label: "경유·추가 정차", price: "사전 협의", note: "동선에 따라" },
    ],
    faq: [
      {
        q: "몇 시간 전에 집에서 출발해야 하나요?",
        a: "항공사·터미널에 따라 다릅니다. 예약 시 편명과 체크인 방식을 알려 주시면 역산해 드립니다.",
      },
      {
        q: "터미널별 하차 위치도 정해 주나요?",
        a: "네. T1/T2 및 출국층 동선에 맞춰 하차 지점을 안내합니다.",
      },
      { q: "새벽 비행도 가능?", a: "가능합니다. 출발 시간은 미리 조율합니다." },
    ],
    primaryCtaLabel: "출국 픽업 예약·문의",
    secondaryCtaLabel: "요금 안내 보기",
    whatsappCtaLabel: "WhatsApp 문의",
    kakaoCtaLabel: "카카오톡 문의",
    homeLinkLabel: "홈으로",
    bookingPathLabel: "/booking",
    hero: hero.ko,
    localBusinessDescription: "",
    areaServedNames: ["Incheon International Airport", "Seoul Metropolitan Area", "South Korea"],
  };
  const en: LandingPageCopy = {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    linkTitle: "",
    h1: "",
    lede: "",
    vehicleRecommendBlurb: "",
    travelTraitsLine: "",
    sections: sEn,
    pricingIntro:
      "Quotes factor pickup address, flight time, tolls, and fuel. Late-night departures are confirmed when you book.",
    pricingItems: [
      { label: "Pickup → ICN", price: "Fixed-rate quote", note: "Tolls included basis" },
      { label: "Late-night pickup", price: "Time-based add-on", note: "Flight-driven windows" },
      { label: "Extra stops", price: "Discussed upfront", note: "Route-dependent" },
    ],
    faq: [
      {
        q: "How early should we leave?",
        a: "Depends on airline cutoffs—we back-plan from your departure city address.",
      },
      { q: "Terminal-specific drop-off?", a: "Yes—share airline and terminal preferences." },
      { q: "Dawn flights?", a: "Supported—pickup times coordinated in advance." },
    ],
    primaryCtaLabel: "Book airport drop-off",
    secondaryCtaLabel: "See pricing",
    whatsappCtaLabel: "WhatsApp",
    kakaoCtaLabel: "KakaoTalk",
    homeLinkLabel: "Home",
    bookingPathLabel: "/booking",
    hero: hero.en,
    localBusinessDescription: "",
    areaServedNames: ["Incheon International Airport", "South Korea"],
  };
  return { ko, en };
}

export function mergeCopy(base: LandingPageCopy, patch: Partial<LandingPageCopy>): LandingPageCopy {
  return {
    ...base,
    ...patch,
    keywords: patch.keywords ?? base.keywords,
    sections: patch.sections ?? base.sections,
    faq: patch.faq ?? base.faq,
    pricingItems: patch.pricingItems ?? base.pricingItems,
    hero: patch.hero ?? base.hero,
    areaServedNames: patch.areaServedNames ?? base.areaServedNames,
  };
}

export function buildPage(
  slug: string,
  jaMetaTitle: string,
  zhMetaTitle: string,
  hero: Record<Loc, LandingPageCopy["hero"]>,
  ko: Partial<LandingPageCopy>,
  en: Partial<LandingPageCopy>,
): LandingPage {
  const t = toAirportBase(hero);
  const k = mergeCopy(t.ko, ko);
  const e = mergeCopy(t.en, en);
  const ja: LandingPageCopy = { ...e, metaTitle: jaMetaTitle };
  const zh: LandingPageCopy = { ...e, metaTitle: zhMetaTitle };
  return { slug, byLocale: { ko: k, en: e, ja, zh } };
}
