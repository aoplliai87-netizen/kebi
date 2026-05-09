import type { ReactNode } from "react";
import { getDefaultHomeHeroSlides } from "@/lib/home-hero-slides";
import { pickLocalized } from "@/lib/home-sections";
import { renderIntroBrandMarkup } from "@/lib/render-brand-markup";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";
import type { FleetVehicleKey } from "@/constants/vehicleFleetImages";
import type { ManagedVehicleMedia } from "@/lib/vehicle-media-types";
import { HOME_DESTINATIONS_FOOTER_PATH } from "@/constants/destinations";
import { getFeaturedDestinationButtonDefaults } from "../../data/landing-pages";

function msgString(messages: Record<string, unknown>, path: string[]): string {
  let cur: unknown = messages;
  for (const key of path) {
    if (!cur || typeof cur !== "object") return "";
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === "string" ? cur.trim() : "";
}


/** 클라이언트 미리보기용 — 서버 buildHomePageViewModel 과 동일 우선순위 (messages 객체 1개 전달) */
export function resolveHomePreviewVm(
  settings: SiteSettings,
  locale: LocaleKey,
  messages: Record<string, unknown>,
  vehicleMain: ManagedVehicleMedia["main"],
): {
  locale: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: ReactNode;
  heroTitleOverride: string;
  heroSubtitleOverride: string;
  heroSlides: string[];
  introEyebrow: string;
  introTitle: string;
  introDesc: ReactNode;
  vehicleEyebrow: string;
  vehicleTitle: string;
  vehicleDesc: string;
  pricingEyebrow: string;
  pricingTitle: string;
  pricingTiers: { label: string; price: string; note: string }[];
  bookingEyebrow: string;
  bookingTitle: string;
  bookingDesc: string;
  bookingCall: string;
  bookingReview: string;
  reviewEyebrow: string;
  reviewTitle: string;
  reviews: { content: string; author: string }[];
  aboutMeTitle: string;
  aboutMeDescription: string;
  galleryImageUrls: string[];
  faqEyebrow: string;
  faqTitle: string;
  faqItems: { q: string; a: string }[];
  vehicleMainImages: Record<FleetVehicleKey, string>;
  destinationsEyebrow: string;
  destinationsTitle: string;
  destinationsDescription: string;
  destinationButtons: { label: string; href: string }[];
  destinationsFooterLabel: string;
  destinationsFooterHref: string;
} {
  const home = settings.home;
  const heroSlides =
    home.heroVisuals.length > 0 ? home.heroVisuals : getDefaultHomeHeroSlides(vehicleMain);

  const heroTitleOverride =
    settings.heroTitleByLocale[locale]?.trim() || settings.heroTitle?.trim() || "";
  const heroSubtitleOverride =
    settings.heroSubtitleByLocale[locale]?.trim() || settings.heroSubtitle?.trim() || "";

  const hp = (path: string[]) => msgString(messages, ["HomePage", ...path]);
  const introHero = (path: string[]) => msgString(messages, ["IntroPage", "hero", ...path]);
  const hf = (path: string[]) => msgString(messages, ["HomeFaq", ...path]);
  const hd = (path: string[]) => msgString(messages, ["HomeDestinations", ...path]);

  const introEyebrow = pickLocalized(home.intro.eyebrow, locale) || introHero(["eyebrow"]);
  const introTitle = pickLocalized(home.intro.title, locale) || introHero(["title"]);
  const introDescCustom = pickLocalized(home.intro.desc, locale);
  const introDesc = introDescCustom
    ? renderIntroBrandMarkup(introDescCustom)
    : renderIntroBrandMarkup(introHero(["desc"]));

  const bookingEyebrow = pickLocalized(home.booking.eyebrow, locale) || hp(["booking", "eyebrow"]);
  const bookingTitle = pickLocalized(home.booking.title, locale) || hp(["booking", "title"]);
  const bookingDesc = pickLocalized(home.booking.desc, locale) || hp(["booking", "desc"]);
  const bookingCall = pickLocalized(home.booking.ctaCall, locale) || hp(["booking", "ctaCall"]);
  const bookingReview =
    pickLocalized(home.booking.ctaReview, locale) || hp(["booking", "ctaReview"]);

  const reviewEyebrow = pickLocalized(home.reviews.eyebrow, locale) || hp(["review", "eyebrow"]);
  const reviewTitle = pickLocalized(home.reviews.title, locale) || hp(["review", "title"]);
  const reviewCandidates = [
    {
      content: pickLocalized(home.reviews.one.content, locale),
      author: pickLocalized(home.reviews.one.author, locale),
    },
    {
      content: pickLocalized(home.reviews.two.content, locale),
      author: pickLocalized(home.reviews.two.author, locale),
    },
    {
      content: pickLocalized(home.reviews.three.content, locale),
      author: pickLocalized(home.reviews.three.author, locale),
    },
  ];
  const hasAllAdminReviews = reviewCandidates.every(
    (r) => r.content.trim().length > 0 && r.author.trim().length > 0,
  );
  const reviews = hasAllAdminReviews ? reviewCandidates : [];

  const faqEyebrow = pickLocalized(home.faq.eyebrow, locale) || hf(["eyebrow"]);
  const faqTitle = pickLocalized(home.faq.title, locale) || hf(["title"]);
  const faqItems = ([1, 2, 3, 4, 5] as const).map((n, idx) => ({
    q: pickLocalized(home.faq.items[idx].q, locale) || hf([`q${n}`]),
    a: pickLocalized(home.faq.items[idx].a, locale) || hf([`a${n}`]),
  }));

  const dest = home.destinations;
  const defaultBtns = getFeaturedDestinationButtonDefaults(locale, dest.featuredSlugs);
  const destinationButtons = [0, 1, 2].map((i) => ({
    label:
      pickLocalized(dest.buttons[i].label, locale).trim() ||
      defaultBtns[i]?.label ||
      "",
    href: dest.buttons[i].href.trim() || defaultBtns[i]?.href || "/",
  }));

  return {
    locale,
    heroEyebrow: hp(["heroEyebrow"]),
    heroTitle: heroTitleOverride || hp(["heroTitle"]),
    heroSubtitle: hp(["heroSubtitle"]),
    heroTitleOverride,
    heroSubtitleOverride,
    heroSlides,
    introEyebrow,
    introTitle,
    introDesc,
    vehicleEyebrow: hp(["vehicle", "eyebrow"]),
    vehicleTitle:
      settings.vehicleSectionTitleByLocale[locale] ||
      settings.vehicleSectionTitle ||
      hp(["vehicle", "cardTitle"]),
    vehicleDesc:
      settings.vehicleSectionDescriptionByLocale[locale] ||
      settings.vehicleSectionDescription ||
      hp(["vehicle", "desc"]),
    pricingEyebrow: hp(["pricing", "eyebrow"]),
    pricingTitle: hp(["pricing", "title"]),
    pricingTiers:
      settings.pricingTiersByLocale[locale]?.length > 0
        ? settings.pricingTiersByLocale[locale]
        : settings.pricingTiers.length > 0
          ? settings.pricingTiers
          : [
              {
                label: hp(["pricing", "airport", "label"]),
                price: hp(["pricing", "airport", "price"]),
                note: hp(["pricing", "airport", "note"]),
              },
              {
                label: hp(["pricing", "city", "label"]),
                price: hp(["pricing", "city", "price"]),
                note: hp(["pricing", "city", "note"]),
              },
              {
                label: hp(["pricing", "charter", "label"]),
                price: hp(["pricing", "charter", "price"]),
                note: hp(["pricing", "charter", "note"]),
              },
            ],
    bookingEyebrow,
    bookingTitle,
    bookingDesc,
    bookingCall,
    bookingReview,
    reviewEyebrow,
    reviewTitle,
    reviews,
    aboutMeTitle: settings.aboutMeTitleByLocale[locale] || settings.aboutMeTitle,
    aboutMeDescription: settings.aboutMeDescriptionByLocale[locale] || settings.aboutMeDescription,
    galleryImageUrls: settings.galleryImageUrls,
    faqEyebrow,
    faqTitle,
    faqItems,
    vehicleMainImages: vehicleMain,
    destinationsEyebrow: pickLocalized(dest.eyebrow, locale) || hd(["eyebrow"]),
    destinationsTitle: pickLocalized(dest.title, locale) || hd(["title"]),
    destinationsDescription: pickLocalized(dest.description, locale) || hd(["description"]),
    destinationButtons,
    destinationsFooterLabel: pickLocalized(dest.footerLabel, locale) || hd(["footerMoreCourses"]),
    destinationsFooterHref: dest.footerHref.trim() || HOME_DESTINATIONS_FOOTER_PATH,
  };
}
