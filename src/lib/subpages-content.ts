import type { LocaleKey, LocalizedText } from "@/lib/site-settings-store";

export type IntroServiceContent = {
  title: LocalizedText;
  body: LocalizedText;
  image: string;
};

export type SubpagesContent = {
  booking: {
    title: LocalizedText;
    description: LocalizedText;
  };
  inquiry: {
    heroEyebrow: LocalizedText;
    heroTitle: LocalizedText;
    heroDesc: LocalizedText;
    faqTitle: LocalizedText;
    faqItems: Array<{ q: LocalizedText; a: LocalizedText }>;
    formTitle: LocalizedText;
    formDesc: LocalizedText;
    contactSectionTitle: LocalizedText;
    contactSectionDesc: LocalizedText;
  };
  intro: {
    brandTitle: LocalizedText;
    sectionLabel: LocalizedText;
    headline: LocalizedText;
    description: LocalizedText;
    coreValueEyebrow: LocalizedText;
    coreValueTitle: LocalizedText;
    coreValueBody: LocalizedText;
    contactEyebrow: LocalizedText;
    representativeName: LocalizedText;
    representativeLine: LocalizedText;
    phoneCaption: LocalizedText;
    services: IntroServiceContent[];
  };
  review: {
    heroEyebrow: LocalizedText;
    heroTitle: LocalizedText;
    heroDesc: LocalizedText;
  };
};

const emptyLocalized = (): LocalizedText => ({ ko: "", en: "", ja: "", zh: "" });

const emptyFaqItem = () => ({ q: emptyLocalized(), a: emptyLocalized() });

export function emptySubpagesContent(): SubpagesContent {
  return {
    booking: {
      title: emptyLocalized(),
      description: emptyLocalized(),
    },
    inquiry: {
      heroEyebrow: emptyLocalized(),
      heroTitle: emptyLocalized(),
      heroDesc: emptyLocalized(),
      faqTitle: emptyLocalized(),
      faqItems: [emptyFaqItem(), emptyFaqItem(), emptyFaqItem(), emptyFaqItem(), emptyFaqItem()],
      formTitle: emptyLocalized(),
      formDesc: emptyLocalized(),
      contactSectionTitle: emptyLocalized(),
      contactSectionDesc: emptyLocalized(),
    },
    intro: {
      brandTitle: emptyLocalized(),
      sectionLabel: emptyLocalized(),
      headline: emptyLocalized(),
      description: emptyLocalized(),
      coreValueEyebrow: emptyLocalized(),
      coreValueTitle: emptyLocalized(),
      coreValueBody: emptyLocalized(),
      contactEyebrow: emptyLocalized(),
      representativeName: emptyLocalized(),
      representativeLine: emptyLocalized(),
      phoneCaption: emptyLocalized(),
      services: [
        { title: emptyLocalized(), body: emptyLocalized(), image: "" },
        { title: emptyLocalized(), body: emptyLocalized(), image: "" },
        { title: emptyLocalized(), body: emptyLocalized(), image: "" },
        { title: emptyLocalized(), body: emptyLocalized(), image: "" },
      ],
    },
    review: {
      heroEyebrow: emptyLocalized(),
      heroTitle: emptyLocalized(),
      heroDesc: emptyLocalized(),
    },
  };
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

export function parseSubpagesContent(value: unknown): SubpagesContent {
  const base = emptySubpagesContent();
  const v = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const booking = v.booking && typeof v.booking === "object" ? (v.booking as Record<string, unknown>) : {};
  const inquiry = v.inquiry && typeof v.inquiry === "object" ? (v.inquiry as Record<string, unknown>) : {};
  const intro = v.intro && typeof v.intro === "object" ? (v.intro as Record<string, unknown>) : {};
  const review = v.review && typeof v.review === "object" ? (v.review as Record<string, unknown>) : {};
  const rawFaqItems = Array.isArray(inquiry.faqItems) ? inquiry.faqItems : [];
  const rawServices = Array.isArray(intro.services) ? intro.services : [];

  return {
    booking: {
      title: parseLocalized(booking.title),
      description: parseLocalized(booking.description),
    },
    inquiry: {
      heroEyebrow: parseLocalized(inquiry.heroEyebrow),
      heroTitle: parseLocalized(inquiry.heroTitle),
      heroDesc: parseLocalized(inquiry.heroDesc),
      faqTitle: parseLocalized(inquiry.faqTitle),
      faqItems: base.inquiry.faqItems.map((_, idx) => {
        const row = rawFaqItems[idx] && typeof rawFaqItems[idx] === "object"
          ? (rawFaqItems[idx] as Record<string, unknown>)
          : {};
        return {
          q: parseLocalized(row.q),
          a: parseLocalized(row.a),
        };
      }),
      formTitle: parseLocalized(inquiry.formTitle),
      formDesc: parseLocalized(inquiry.formDesc),
      contactSectionTitle: parseLocalized(inquiry.contactSectionTitle),
      contactSectionDesc: parseLocalized(inquiry.contactSectionDesc),
    },
    intro: {
      brandTitle: parseLocalized(intro.brandTitle),
      sectionLabel: parseLocalized(intro.sectionLabel),
      headline: parseLocalized(intro.headline),
      description: parseLocalized(intro.description),
      coreValueEyebrow: parseLocalized(intro.coreValueEyebrow),
      coreValueTitle: parseLocalized(intro.coreValueTitle),
      coreValueBody: parseLocalized(intro.coreValueBody),
      contactEyebrow: parseLocalized(intro.contactEyebrow),
      representativeName: parseLocalized(intro.representativeName),
      representativeLine: parseLocalized(intro.representativeLine),
      phoneCaption: parseLocalized(intro.phoneCaption),
      services: base.intro.services.map((_, idx) => {
        const row = rawServices[idx] && typeof rawServices[idx] === "object"
          ? (rawServices[idx] as Record<string, unknown>)
          : {};
        return {
          title: parseLocalized(row.title),
          body: parseLocalized(row.body),
          image: typeof row.image === "string" ? row.image.trim() : "",
        };
      }),
    },
    review: {
      heroEyebrow: parseLocalized(review.heroEyebrow),
      heroTitle: parseLocalized(review.heroTitle),
      heroDesc: parseLocalized(review.heroDesc),
    },
  };
}

export function pickSubpageLocalized(value: LocalizedText, locale: LocaleKey): string {
  return (
    value[locale]?.trim() ||
    value.ko?.trim() ||
    value.en?.trim() ||
    value.ja?.trim() ||
    value.zh?.trim() ||
    ""
  );
}
