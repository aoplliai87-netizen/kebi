import type { LocaleKey, LocalizedText } from "@/lib/site-settings-store";

export type AdminContentFallbacks = {
  booking: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    desc: LocalizedText;
    ctaCall: LocalizedText;
    ctaReview: LocalizedText;
  };
  reviews: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    one: { content: LocalizedText; author: LocalizedText };
    two: { content: LocalizedText; author: LocalizedText };
    three: { content: LocalizedText; author: LocalizedText };
  };
  faq: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    items: Array<{ q: LocalizedText; a: LocalizedText }>;
  };
  subpages: {
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
      services: Array<{ title: LocalizedText; body: LocalizedText }>;
    };
    review: {
      heroEyebrow: LocalizedText;
      heroTitle: LocalizedText;
      heroDesc: LocalizedText;
    };
  };
};

function emptyLocalized(): LocalizedText {
  return { ko: "", en: "", ja: "", zh: "" };
}

function getString(obj: unknown, path: string[]): string {
  let cur: unknown = obj;
  for (const key of path) {
    if (!cur || typeof cur !== "object") return "";
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === "string" ? cur.trim() : "";
}

export async function buildAdminContentFallbacks(): Promise<AdminContentFallbacks> {
  const locales: LocaleKey[] = ["ko", "en", "ja", "zh"];
  const localeJson = await Promise.all(locales.map(async (locale) => {
    const mod = await import(`../../messages/${locale}.json`);
    return mod.default as Record<string, unknown>;
  }));

  const byLocale = (path: string[]): LocalizedText => {
    const out = emptyLocalized();
    locales.forEach((locale, idx) => {
      out[locale] = getString(localeJson[idx], path);
    });
    return out;
  };

  const faqItems = [1, 2, 3, 4, 5].map((n) => ({
    q: byLocale(["HomeFaq", `q${n}`]),
    a: byLocale(["HomeFaq", `a${n}`]),
  }));
  const inquiryFaqItems = [1, 2, 3, 4, 5].map((n) => ({
    q: byLocale(["Support", `faq${n}Q`]),
    a: byLocale(["Support", `faq${n}A`]),
  }));
  const introServices = ["s01", "s02", "s03", "s04"].map((id) => ({
    title: byLocale(["IntroPage", "services", id, "title"]),
    body: byLocale(["IntroPage", "services", id, "body"]),
  }));

  return {
    booking: {
      eyebrow: byLocale(["HomePage", "booking", "eyebrow"]),
      title: byLocale(["HomePage", "booking", "title"]),
      desc: byLocale(["HomePage", "booking", "desc"]),
      ctaCall: byLocale(["HomePage", "booking", "ctaCall"]),
      ctaReview: byLocale(["HomePage", "booking", "ctaReview"]),
    },
    reviews: {
      eyebrow: byLocale(["HomePage", "review", "eyebrow"]),
      title: byLocale(["HomePage", "review", "title"]),
      one: {
        content: byLocale(["HomePage", "review", "one", "content"]),
        author: byLocale(["HomePage", "review", "one", "author"]),
      },
      two: {
        content: byLocale(["HomePage", "review", "two", "content"]),
        author: byLocale(["HomePage", "review", "two", "author"]),
      },
      three: {
        content: byLocale(["HomePage", "review", "three", "content"]),
        author: byLocale(["HomePage", "review", "three", "author"]),
      },
    },
    faq: {
      eyebrow: byLocale(["HomeFaq", "eyebrow"]),
      title: byLocale(["HomeFaq", "title"]),
      items: faqItems,
    },
    subpages: {
      booking: {
        title: byLocale(["HomePage", "booking", "title"]),
        description: byLocale(["HomePage", "booking", "desc"]),
      },
      inquiry: {
        heroEyebrow: byLocale(["Support", "heroEyebrow"]),
        heroTitle: byLocale(["Support", "heroTitle"]),
        heroDesc: byLocale(["Support", "heroDesc"]),
        faqTitle: byLocale(["Support", "faqTitle"]),
        faqItems: inquiryFaqItems,
        formTitle: byLocale(["Support", "formTitle"]),
        formDesc: byLocale(["Support", "formDesc"]),
        contactSectionTitle: byLocale(["Support", "contactSectionTitle"]),
        contactSectionDesc: byLocale(["Support", "contactSectionDesc"]),
      },
      intro: {
        brandTitle: byLocale(["IntroPage", "hero", "brandTitle"]),
        sectionLabel: byLocale(["IntroPage", "hero", "eyebrow"]),
        headline: byLocale(["IntroPage", "hero", "title"]),
        description: byLocale(["IntroPage", "hero", "desc"]),
        coreValueEyebrow: byLocale(["IntroPage", "coreValueEyebrow"]),
        coreValueTitle: byLocale(["IntroPage", "coreValueTitle"]),
        coreValueBody: byLocale(["IntroPage", "coreValueBody"]),
        contactEyebrow: byLocale(["IntroPage", "contactEyebrow"]),
        representativeName: byLocale(["IntroPage", "representativeName"]),
        representativeLine: byLocale(["IntroPage", "representativeLine"]),
        phoneCaption: byLocale(["IntroPage", "phoneCaption"]),
        services: introServices,
      },
      review: {
        heroEyebrow: byLocale(["HomePage", "review", "eyebrow"]),
        heroTitle: byLocale(["HomePage", "review", "title"]),
        heroDesc: byLocale(["HomePage", "review", "heroDesc"]),
      },
    },
  };
}
