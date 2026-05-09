import { getFeaturedDestinationButtonDefaults } from "../../data/landing-pages";
import { HOME_DESTINATIONS_FOOTER_PATH } from "@/constants/destinations";
import { persistIfDiffersFromFallback, msgAt } from "@/lib/admin-visual-effective";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh"];

/** 저장 시 번역 기본문과 동일한 오버라이드는 빈 문자열로 줄여 중복 저장을 방지합니다. */
export function normalizeSiteSettingsForPersist(
  draft: SiteSettings,
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>,
): SiteSettings {
  const next = structuredClone(draft);

  for (const loc of LOCALES) {
    const m = messagesByLocale[loc];
    const hp = (...p: string[]) => msgAt(m, ["HomePage", ...p]);
    const ih = (...p: string[]) => msgAt(m, ["IntroPage", "hero", ...p]);
    const hf = (...p: string[]) => msgAt(m, ["HomeFaq", ...p]);
    const hd = (...p: string[]) => msgAt(m, ["HomeDestinations", ...p]);

    next.heroTitleByLocale[loc] = persistIfDiffersFromFallback(
      next.heroTitleByLocale[loc] ?? "",
      hp("heroTitle"),
    );
    next.heroSubtitleByLocale[loc] = persistIfDiffersFromFallback(
      next.heroSubtitleByLocale[loc] ?? "",
      hp("heroSubtitle"),
    );

    next.home.intro.eyebrow[loc] = persistIfDiffersFromFallback(
      next.home.intro.eyebrow[loc] ?? "",
      ih("eyebrow"),
    );
    next.home.intro.title[loc] = persistIfDiffersFromFallback(next.home.intro.title[loc] ?? "", ih("title"));
    next.home.intro.desc[loc] = persistIfDiffersFromFallback(next.home.intro.desc[loc] ?? "", ih("desc"));

    next.vehicleSectionTitleByLocale[loc] = persistIfDiffersFromFallback(
      next.vehicleSectionTitleByLocale[loc] ?? "",
      hp("vehicle", "cardTitle"),
    );
    next.vehicleSectionDescriptionByLocale[loc] = persistIfDiffersFromFallback(
      next.vehicleSectionDescriptionByLocale[loc] ?? "",
      hp("vehicle", "desc"),
    );

    const pricingFb = [
      {
        label: hp("pricing", "airport", "label"),
        price: hp("pricing", "airport", "price"),
        note: hp("pricing", "airport", "note"),
      },
      {
        label: hp("pricing", "city", "label"),
        price: hp("pricing", "city", "price"),
        note: hp("pricing", "city", "note"),
      },
      {
        label: hp("pricing", "charter", "label"),
        price: hp("pricing", "charter", "price"),
        note: hp("pricing", "charter", "note"),
      },
    ];
    const rows = [...(next.pricingTiersByLocale[loc] ?? [])];
    while (rows.length < 3) rows.push({ label: "", price: "", note: "" });
    for (let i = 0; i < 3; i++) {
      rows[i] = {
        label: persistIfDiffersFromFallback(rows[i]?.label ?? "", pricingFb[i].label),
        price: persistIfDiffersFromFallback(rows[i]?.price ?? "", pricingFb[i].price),
        note: persistIfDiffersFromFallback(rows[i]?.note ?? "", pricingFb[i].note),
      };
    }
    next.pricingTiersByLocale[loc] = rows;

    next.home.booking.eyebrow[loc] = persistIfDiffersFromFallback(
      next.home.booking.eyebrow[loc] ?? "",
      hp("booking", "eyebrow"),
    );
    next.home.booking.title[loc] = persistIfDiffersFromFallback(
      next.home.booking.title[loc] ?? "",
      hp("booking", "title"),
    );
    next.home.booking.desc[loc] = persistIfDiffersFromFallback(
      next.home.booking.desc[loc] ?? "",
      hp("booking", "desc"),
    );
    next.home.booking.ctaCall[loc] = persistIfDiffersFromFallback(
      next.home.booking.ctaCall[loc] ?? "",
      hp("booking", "ctaCall"),
    );
    next.home.booking.ctaReview[loc] = persistIfDiffersFromFallback(
      next.home.booking.ctaReview[loc] ?? "",
      hp("booking", "ctaReview"),
    );

    next.home.reviews.eyebrow[loc] = persistIfDiffersFromFallback(
      next.home.reviews.eyebrow[loc] ?? "",
      hp("review", "eyebrow"),
    );
    next.home.reviews.title[loc] = persistIfDiffersFromFallback(
      next.home.reviews.title[loc] ?? "",
      hp("review", "title"),
    );

    next.home.destinations.eyebrow[loc] = persistIfDiffersFromFallback(
      next.home.destinations.eyebrow[loc] ?? "",
      hd("eyebrow"),
    );
    next.home.destinations.title[loc] = persistIfDiffersFromFallback(
      next.home.destinations.title[loc] ?? "",
      hd("title"),
    );
    next.home.destinations.description[loc] = persistIfDiffersFromFallback(
      next.home.destinations.description[loc] ?? "",
      hd("description"),
    );
    next.home.destinations.footerLabel[loc] = persistIfDiffersFromFallback(
      next.home.destinations.footerLabel[loc] ?? "",
      hd("footerMoreCourses"),
    );
    next.home.destinations.footerHref = persistIfDiffersFromFallback(
      next.home.destinations.footerHref ?? "",
      HOME_DESTINATIONS_FOOTER_PATH,
    );

    const destBtns = getFeaturedDestinationButtonDefaults(loc, next.home.destinations.featuredSlugs);
    for (let i = 0; i < 3; i++) {
      next.home.destinations.buttons[i].label[loc] = persistIfDiffersFromFallback(
        next.home.destinations.buttons[i].label[loc] ?? "",
        destBtns[i]?.label ?? "",
      );
      next.home.destinations.buttons[i].href = persistIfDiffersFromFallback(
        next.home.destinations.buttons[i].href ?? "",
        destBtns[i]?.href ?? "/",
      );
    }

    next.home.faq.eyebrow[loc] = persistIfDiffersFromFallback(
      next.home.faq.eyebrow[loc] ?? "",
      hf("eyebrow"),
    );
    next.home.faq.title[loc] = persistIfDiffersFromFallback(next.home.faq.title[loc] ?? "", hf("title"));
    const fqKeys = ["q1", "q2", "q3", "q4", "q5"] as const;
    const faKeys = ["a1", "a2", "a3", "a4", "a5"] as const;
    for (let idx = 0; idx < 5; idx++) {
      next.home.faq.items[idx].q[loc] = persistIfDiffersFromFallback(
        next.home.faq.items[idx].q[loc] ?? "",
        hf(fqKeys[idx]),
      );
      next.home.faq.items[idx].a[loc] = persistIfDiffersFromFallback(
        next.home.faq.items[idx].a[loc] ?? "",
        hf(faKeys[idx]),
      );
    }

    const sup = (...p: string[]) => msgAt(m, ["Support", ...p]);
    const iph = (...p: string[]) => msgAt(m, ["IntroPage", "hero", ...p]);
    const svc = (id: string, field: "title" | "body") => msgAt(m, ["IntroPage", "services", id, field]);

    next.subpages.booking.title[loc] = persistIfDiffersFromFallback(
      next.subpages.booking.title[loc] ?? "",
      hp("booking", "title"),
    );
    next.subpages.booking.description[loc] = persistIfDiffersFromFallback(
      next.subpages.booking.description[loc] ?? "",
      hp("booking", "desc"),
    );

    next.subpages.review.heroEyebrow[loc] = persistIfDiffersFromFallback(
      next.subpages.review.heroEyebrow[loc] ?? "",
      hp("review", "eyebrow"),
    );
    next.subpages.review.heroTitle[loc] = persistIfDiffersFromFallback(
      next.subpages.review.heroTitle[loc] ?? "",
      hp("review", "title"),
    );
    next.subpages.review.heroDesc[loc] = persistIfDiffersFromFallback(
      next.subpages.review.heroDesc[loc] ?? "",
      hp("review", "heroDesc"),
    );

    next.subpages.inquiry.heroEyebrow[loc] = persistIfDiffersFromFallback(
      next.subpages.inquiry.heroEyebrow[loc] ?? "",
      sup("heroEyebrow"),
    );
    next.subpages.inquiry.heroTitle[loc] = persistIfDiffersFromFallback(
      next.subpages.inquiry.heroTitle[loc] ?? "",
      sup("heroTitle"),
    );
    next.subpages.inquiry.heroDesc[loc] = persistIfDiffersFromFallback(
      next.subpages.inquiry.heroDesc[loc] ?? "",
      sup("heroDesc"),
    );
    next.subpages.inquiry.faqTitle[loc] = persistIfDiffersFromFallback(
      next.subpages.inquiry.faqTitle[loc] ?? "",
      sup("faqTitle"),
    );
    for (let fi = 0; fi < 5; fi++) {
      const n = fi + 1;
      next.subpages.inquiry.faqItems[fi].q[loc] = persistIfDiffersFromFallback(
        next.subpages.inquiry.faqItems[fi].q[loc] ?? "",
        sup(`faq${n}Q`),
      );
      next.subpages.inquiry.faqItems[fi].a[loc] = persistIfDiffersFromFallback(
        next.subpages.inquiry.faqItems[fi].a[loc] ?? "",
        sup(`faq${n}A`),
      );
    }
    next.subpages.inquiry.formTitle[loc] = persistIfDiffersFromFallback(
      next.subpages.inquiry.formTitle[loc] ?? "",
      sup("formTitle"),
    );
    next.subpages.inquiry.formDesc[loc] = persistIfDiffersFromFallback(
      next.subpages.inquiry.formDesc[loc] ?? "",
      sup("formDesc"),
    );
    next.subpages.inquiry.contactSectionTitle[loc] = persistIfDiffersFromFallback(
      next.subpages.inquiry.contactSectionTitle[loc] ?? "",
      sup("contactSectionTitle"),
    );
    next.subpages.inquiry.contactSectionDesc[loc] = persistIfDiffersFromFallback(
      next.subpages.inquiry.contactSectionDesc[loc] ?? "",
      sup("contactSectionDesc"),
    );

    next.subpages.intro.brandTitle[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.brandTitle[loc] ?? "",
      iph("brandTitle"),
    );
    next.subpages.intro.sectionLabel[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.sectionLabel[loc] ?? "",
      iph("eyebrow"),
    );
    next.subpages.intro.headline[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.headline[loc] ?? "",
      iph("title"),
    );
    next.subpages.intro.description[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.description[loc] ?? "",
      iph("desc"),
    );
    next.subpages.intro.coreValueEyebrow[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.coreValueEyebrow[loc] ?? "",
      msgAt(m, ["IntroPage", "coreValueEyebrow"]),
    );
    next.subpages.intro.coreValueTitle[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.coreValueTitle[loc] ?? "",
      msgAt(m, ["IntroPage", "coreValueTitle"]),
    );
    next.subpages.intro.coreValueBody[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.coreValueBody[loc] ?? "",
      msgAt(m, ["IntroPage", "coreValueBody"]),
    );
    next.subpages.intro.contactEyebrow[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.contactEyebrow[loc] ?? "",
      msgAt(m, ["IntroPage", "contactEyebrow"]),
    );
    next.subpages.intro.representativeName[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.representativeName[loc] ?? "",
      msgAt(m, ["IntroPage", "representativeName"]),
    );
    next.subpages.intro.representativeLine[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.representativeLine[loc] ?? "",
      msgAt(m, ["IntroPage", "representativeLine"]),
    );
    next.subpages.intro.phoneCaption[loc] = persistIfDiffersFromFallback(
      next.subpages.intro.phoneCaption[loc] ?? "",
      msgAt(m, ["IntroPage", "phoneCaption"]),
    );
    const svcIds = ["s01", "s02", "s03", "s04"] as const;
    for (let si = 0; si < 4; si++) {
      const id = svcIds[si];
      next.subpages.intro.services[si].title[loc] = persistIfDiffersFromFallback(
        next.subpages.intro.services[si].title[loc] ?? "",
        svc(id, "title"),
      );
      next.subpages.intro.services[si].body[loc] = persistIfDiffersFromFallback(
        next.subpages.intro.services[si].body[loc] ?? "",
        svc(id, "body"),
      );
    }

    next.home.reviews.one.content[loc] = persistIfDiffersFromFallback(
      next.home.reviews.one.content[loc] ?? "",
      hp("review", "one", "content"),
    );
    next.home.reviews.one.author[loc] = persistIfDiffersFromFallback(
      next.home.reviews.one.author[loc] ?? "",
      hp("review", "one", "author"),
    );
    next.home.reviews.two.content[loc] = persistIfDiffersFromFallback(
      next.home.reviews.two.content[loc] ?? "",
      hp("review", "two", "content"),
    );
    next.home.reviews.two.author[loc] = persistIfDiffersFromFallback(
      next.home.reviews.two.author[loc] ?? "",
      hp("review", "two", "author"),
    );
    next.home.reviews.three.content[loc] = persistIfDiffersFromFallback(
      next.home.reviews.three.content[loc] ?? "",
      hp("review", "three", "content"),
    );
    next.home.reviews.three.author[loc] = persistIfDiffersFromFallback(
      next.home.reviews.three.author[loc] ?? "",
      hp("review", "three", "author"),
    );
  }

  return next;
}
