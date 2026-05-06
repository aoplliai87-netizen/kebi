import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BespokeHomeExperience } from "@/components/home/BespokeHomeExperience";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
import { getSiteSettings } from "@/lib/site-settings-store";
import {
  SITE_FACEBOOK_MESSENGER_URL,
  SITE_INSTAGRAM_DM_URL,
  SITE_KAKAO_CHAT_URL,
  SITE_LINE_URL,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const meta = await getLocalizedPageMetadata(params.locale, "home");
  const siteSettings = await getSiteSettings();
  const seoTitle = siteSettings.seoHomeTitleByLocale[params.locale as "ko" | "en" | "ja" | "zh"] || siteSettings.seoHomeTitle;
  const seoDesc =
    siteSettings.seoHomeDescriptionByLocale[params.locale as "ko" | "en" | "ja" | "zh"] ||
    siteSettings.seoHomeDescription;
  return {
    ...meta,
    title: seoTitle || meta.title,
    description: seoDesc || meta.description,
    openGraph: {
      ...meta.openGraph,
      title: seoTitle || meta.openGraph?.title,
      description: seoDesc || meta.openGraph?.description,
    },
    twitter: {
      ...meta.twitter,
      title: seoTitle || meta.twitter?.title,
      description: seoDesc || meta.twitter?.description,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  const tIntroHero = await getTranslations("IntroPage.hero");
  const siteSettings = await getSiteSettings();
  const localeKey = locale as "ko" | "en" | "ja" | "zh";
  const mergedLinks = {
    kakao: siteSettings.contactLinks.kakao || SITE_KAKAO_CHAT_URL,
    instagram: siteSettings.contactLinks.instagram || SITE_INSTAGRAM_DM_URL,
    whatsapp: siteSettings.contactLinks.whatsapp || SITE_WHATSAPP_URL,
    line: siteSettings.contactLinks.line || SITE_LINE_URL,
    messenger: siteSettings.contactLinks.messenger || SITE_FACEBOOK_MESSENGER_URL,
  };

  return (
    <BespokeHomeExperience
      locale={locale}
      heroEyebrow={t("heroEyebrow")}
      heroTitle={siteSettings.heroTitleByLocale[localeKey] || t("heroTitle")}
      heroSubtitle={siteSettings.heroSubtitleByLocale[localeKey] || t.rich("heroSubtitle", {
        brand: (chunks) => (
          <span className="font-semibold text-brand-gold [font-size:1.28em] leading-snug tracking-tight drop-shadow-[0_0_24px_rgba(212,175,55,0.2)]">
            {chunks}
          </span>
        ),
      })}
      introEyebrow={tIntroHero("eyebrow")}
      introTitle={tIntroHero("title")}
      introDesc={tIntroHero.rich("desc", {
        brand: (chunks) => (
          <span className="font-semibold text-brand-gold">{chunks}</span>
        ),
      })}
      vehicleEyebrow={t("vehicle.eyebrow")}
      vehicleTitle={siteSettings.vehicleSectionTitleByLocale[localeKey] || siteSettings.vehicleSectionTitle || t("vehicle.cardTitle")}
      vehicleDesc={siteSettings.vehicleSectionDescriptionByLocale[localeKey] || siteSettings.vehicleSectionDescription || t("vehicle.desc")}
      pricingEyebrow={t("pricing.eyebrow")}
      pricingTitle={t("pricing.title")}
      pricingTiers={
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
            ]
      }
      bookingEyebrow={t("booking.eyebrow")}
      bookingTitle={t("booking.title")}
      bookingDesc={t("booking.desc")}
      bookingCall={t("booking.ctaCall")}
      bookingReview={t("booking.ctaReview")}
      reviewEyebrow={t("review.eyebrow")}
      reviewTitle={t("review.title")}
      reviews={[
        { content: t("review.one.content"), author: t("review.one.author") },
        { content: t("review.two.content"), author: t("review.two.author") },
        { content: t("review.three.content"), author: t("review.three.author") },
      ]}
      aboutMeTitle={siteSettings.aboutMeTitleByLocale[localeKey] || siteSettings.aboutMeTitle}
      aboutMeDescription={siteSettings.aboutMeDescriptionByLocale[localeKey] || siteSettings.aboutMeDescription}
      galleryImageUrls={siteSettings.galleryImageUrls}
      phoneTel={siteSettings.phoneTel || SITE_PHONE_TEL}
      contactLinks={mergedLinks}
      heroTitleOverride={siteSettings.heroTitleByLocale[localeKey] || siteSettings.heroTitle}
      heroSubtitleOverride={siteSettings.heroSubtitleByLocale[localeKey] || siteSettings.heroSubtitle}
    />
  );
}
