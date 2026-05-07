import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { pickLocalized } from "@/lib/home-sections";
import { getDefaultHomeHeroSlides } from "@/lib/home-hero-slides";
import { renderIntroBrandMarkup } from "@/lib/render-brand-markup";
import { type LocaleKey, type SiteSettings, getSiteSettings } from "@/lib/site-settings-store";
import type { ManagedVehicleMedia } from "@/lib/vehicle-media-types";
import { getManagedVehicleMedia } from "@/lib/vehicle-media-store";

type HomeViewModel = {
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
  vehicleMainImages: ManagedVehicleMedia["main"];
};

export async function buildHomePageViewModel(
  locale: string,
  options?: {
    siteSettings?: SiteSettings;
    vehicleMedia?: ManagedVehicleMedia;
  },
): Promise<HomeViewModel> {
  const localeKey = locale as LocaleKey;
  const [t, tIntroHero, tFaq, siteSettings, vehicleMedia] = await Promise.all([
    getTranslations({ locale, namespace: "HomePage" }),
    getTranslations({ locale, namespace: "IntroPage.hero" }),
    getTranslations({ locale, namespace: "HomeFaq" }),
    options?.siteSettings ? Promise.resolve(options.siteSettings) : getSiteSettings(),
    options?.vehicleMedia ? Promise.resolve(options.vehicleMedia) : getManagedVehicleMedia(),
  ]);

  const home = siteSettings.home;
  const heroSlides =
    home.heroVisuals.length > 0
      ? home.heroVisuals
      : getDefaultHomeHeroSlides(vehicleMedia.main);
  const heroTitleOverride =
    siteSettings.heroTitleByLocale[localeKey]?.trim() ||
    siteSettings.heroTitle?.trim() ||
    "";
  const heroSubtitleOverride =
    siteSettings.heroSubtitleByLocale[localeKey]?.trim() ||
    siteSettings.heroSubtitle?.trim() ||
    "";

  const introEyebrow = pickLocalized(home.intro.eyebrow, localeKey) || tIntroHero("eyebrow");
  const introTitle = pickLocalized(home.intro.title, localeKey) || tIntroHero("title");
  const introDescCustom = pickLocalized(home.intro.desc, localeKey);
  const introDesc = introDescCustom
    ? renderIntroBrandMarkup(introDescCustom)
    : tIntroHero.rich("desc", {
        brand: (chunks) => (
          <span className="font-semibold text-brand-gold">{chunks}</span>
        ),
      });

  const bookingEyebrow = pickLocalized(home.booking.eyebrow, localeKey) || t("booking.eyebrow");
  const bookingTitle = pickLocalized(home.booking.title, localeKey) || t("booking.title");
  const bookingDesc = pickLocalized(home.booking.desc, localeKey) || t("booking.desc");
  const bookingCall = pickLocalized(home.booking.ctaCall, localeKey) || t("booking.ctaCall");
  const bookingReview = pickLocalized(home.booking.ctaReview, localeKey) || t("booking.ctaReview");

  const reviewEyebrow = pickLocalized(home.reviews.eyebrow, localeKey) || t("review.eyebrow");
  const reviewTitle = pickLocalized(home.reviews.title, localeKey) || t("review.title");
  const reviewCandidates = [
    {
      content: pickLocalized(home.reviews.one.content, localeKey),
      author: pickLocalized(home.reviews.one.author, localeKey),
    },
    {
      content: pickLocalized(home.reviews.two.content, localeKey),
      author: pickLocalized(home.reviews.two.author, localeKey),
    },
    {
      content: pickLocalized(home.reviews.three.content, localeKey),
      author: pickLocalized(home.reviews.three.author, localeKey),
    },
  ];
  const hasAllAdminReviews = reviewCandidates.every(
    (r) => r.content.trim().length > 0 && r.author.trim().length > 0,
  );
  const reviews = hasAllAdminReviews ? reviewCandidates : [];

  const faqEyebrow = pickLocalized(home.faq.eyebrow, localeKey) || tFaq("eyebrow");
  const faqTitle = pickLocalized(home.faq.title, localeKey) || tFaq("title");
  const faqItems = ([1, 2, 3, 4, 5] as const).map((n, idx) => ({
    q: pickLocalized(home.faq.items[idx].q, localeKey) || tFaq(`q${n}`),
    a: pickLocalized(home.faq.items[idx].a, localeKey) || tFaq(`a${n}`),
  }));

  return {
    locale,
    heroEyebrow: t("heroEyebrow"),
    heroTitle: heroTitleOverride || t("heroTitle"),
    heroSubtitle: t.rich("heroSubtitle", {
      brand: (chunks) => (
        <span className="font-semibold text-brand-gold [font-size:1.28em] leading-snug tracking-tight drop-shadow-[0_0_24px_rgba(212,175,55,0.2)]">
          {chunks}
        </span>
      ),
    }),
    heroTitleOverride,
    heroSubtitleOverride,
    heroSlides,
    introEyebrow,
    introTitle,
    introDesc,
    vehicleEyebrow: t("vehicle.eyebrow"),
    vehicleTitle:
      siteSettings.vehicleSectionTitleByLocale[localeKey] ||
      siteSettings.vehicleSectionTitle ||
      t("vehicle.cardTitle"),
    vehicleDesc:
      siteSettings.vehicleSectionDescriptionByLocale[localeKey] ||
      siteSettings.vehicleSectionDescription ||
      t("vehicle.desc"),
    pricingEyebrow: t("pricing.eyebrow"),
    pricingTitle: t("pricing.title"),
    pricingTiers:
      siteSettings.pricingTiersByLocale[localeKey]?.length > 0
        ? siteSettings.pricingTiersByLocale[localeKey]
        : siteSettings.pricingTiers.length > 0
          ? siteSettings.pricingTiers
          : [
              {
                label: t("pricing.airport.label"),
                price: t("pricing.airport.price"),
                note: t("pricing.airport.note"),
              },
              {
                label: t("pricing.city.label"),
                price: t("pricing.city.price"),
                note: t("pricing.city.note"),
              },
              {
                label: t("pricing.charter.label"),
                price: t("pricing.charter.price"),
                note: t("pricing.charter.note"),
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
    aboutMeTitle:
      siteSettings.aboutMeTitleByLocale[localeKey] || siteSettings.aboutMeTitle,
    aboutMeDescription:
      siteSettings.aboutMeDescriptionByLocale[localeKey] || siteSettings.aboutMeDescription,
    galleryImageUrls: siteSettings.galleryImageUrls,
    faqEyebrow,
    faqTitle,
    faqItems,
    vehicleMainImages: vehicleMedia.main,
  };
}
