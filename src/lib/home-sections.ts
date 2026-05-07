import type { LocaleKey, LocalizedText } from "@/lib/site-settings-store";

/** 홈 Intro 블록 — IntroPage.hero 와 동일 역할, `<brand>...</brand>` 지원 */
export type HomeIntroSection = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  desc: LocalizedText;
};

export type HomeBookingSection = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  desc: LocalizedText;
  ctaCall: LocalizedText;
  ctaReview: LocalizedText;
};

export type HomeReviewSlot = {
  content: LocalizedText;
  author: LocalizedText;
};

export type HomeReviewsSection = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  one: HomeReviewSlot;
  two: HomeReviewSlot;
  three: HomeReviewSlot;
};

export type HomeFaqPair = {
  q: LocalizedText;
  a: LocalizedText;
};

export type HomeFaqSectionContent = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  items: [HomeFaqPair, HomeFaqPair, HomeFaqPair, HomeFaqPair, HomeFaqPair];
};

/** site-settings 의 home.* 통합 블록 */
export type HomeSections = {
  /** 홈 히어로 배경 슬라이드 이미지 URL 목록 (언어 공통) */
  heroVisuals: string[];
  intro: HomeIntroSection;
  booking: HomeBookingSection;
  reviews: HomeReviewsSection;
  faq: HomeFaqSectionContent;
};

const EMPTY: LocalizedText = { ko: "", en: "", ja: "", zh: "" };

function lt(v: unknown): LocalizedText {
  if (!v || typeof v !== "object") return { ...EMPTY };
  const o = v as Partial<LocalizedText>;
  return {
    ko: typeof o.ko === "string" ? o.ko.trim() : "",
    en: typeof o.en === "string" ? o.en.trim() : "",
    ja: typeof o.ja === "string" ? o.ja.trim() : "",
    zh: typeof o.zh === "string" ? o.zh.trim() : "",
  };
}

function parseReviewSlot(v: unknown): HomeReviewSlot {
  if (!v || typeof v !== "object") return { content: { ...EMPTY }, author: { ...EMPTY } };
  const o = v as Partial<HomeReviewSlot>;
  return { content: lt(o.content), author: lt(o.author) };
}

function parseFaqPair(v: unknown): HomeFaqPair {
  if (!v || typeof v !== "object") return { q: { ...EMPTY }, a: { ...EMPTY } };
  const o = v as Partial<HomeFaqPair>;
  return { q: lt(o.q), a: lt(o.a) };
}

export function emptyHomeSections(): HomeSections {
  const slot = (): HomeReviewSlot => ({ content: { ...EMPTY }, author: { ...EMPTY } });
  const pair = (): HomeFaqPair => ({ q: { ...EMPTY }, a: { ...EMPTY } });
  return {
    heroVisuals: [],
    intro: { eyebrow: { ...EMPTY }, title: { ...EMPTY }, desc: { ...EMPTY } },
    booking: {
      eyebrow: { ...EMPTY },
      title: { ...EMPTY },
      desc: { ...EMPTY },
      ctaCall: { ...EMPTY },
      ctaReview: { ...EMPTY },
    },
    reviews: {
      eyebrow: { ...EMPTY },
      title: { ...EMPTY },
      one: slot(),
      two: slot(),
      three: slot(),
    },
    faq: {
      eyebrow: { ...EMPTY },
      title: { ...EMPTY },
      items: [pair(), pair(), pair(), pair(), pair()],
    },
  };
}

export function parseHomeSections(value: unknown): HomeSections {
  const base = emptyHomeSections();
  if (!value || typeof value !== "object") return base;
  const h = value as Partial<HomeSections>;

  if (Array.isArray((h as { heroVisuals?: unknown }).heroVisuals)) {
    const raw = (h as { heroVisuals?: unknown }).heroVisuals as unknown[];
    base.heroVisuals = raw
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  if (h.intro && typeof h.intro === "object") {
    base.intro = {
      eyebrow: lt(h.intro.eyebrow),
      title: lt(h.intro.title),
      desc: lt(h.intro.desc),
    };
  }
  if (h.booking && typeof h.booking === "object") {
    base.booking = {
      eyebrow: lt(h.booking.eyebrow),
      title: lt(h.booking.title),
      desc: lt(h.booking.desc),
      ctaCall: lt(h.booking.ctaCall),
      ctaReview: lt(h.booking.ctaReview),
    };
  }
  if (h.reviews && typeof h.reviews === "object") {
    base.reviews = {
      eyebrow: lt(h.reviews.eyebrow),
      title: lt(h.reviews.title),
      one: parseReviewSlot(h.reviews.one),
      two: parseReviewSlot(h.reviews.two),
      three: parseReviewSlot(h.reviews.three),
    };
  }
  if (h.faq && typeof h.faq === "object") {
    const itemsRaw = Array.isArray(h.faq.items) ? h.faq.items : [];
    const items = [0, 1, 2, 3, 4].map((i) => parseFaqPair(itemsRaw[i])) as HomeFaqSectionContent["items"];
    base.faq = {
      eyebrow: lt(h.faq.eyebrow),
      title: lt(h.faq.title),
      items,
    };
  }
  return base;
}

export function pickLocalized(text: LocalizedText, locale: LocaleKey): string {
  return text[locale]?.trim() || text.ko?.trim() || text.en?.trim() || text.ja?.trim() || text.zh?.trim() || "";
}
