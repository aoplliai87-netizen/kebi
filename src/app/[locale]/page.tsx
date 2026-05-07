import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { BespokeHomeExperience } from "@/components/home/BespokeHomeExperience";
import { HomeDestinationsLinks } from "@/components/home/HomeDestinationsLinks";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { buildHomePageViewModel } from "@/lib/home-page-view-model";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
import { getSiteSettings } from "@/lib/site-settings-store";
import { getManagedVehicleMedia } from "@/lib/vehicle-media-store";
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

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  noStore();
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
  noStore();
  const { locale } = params;
  const [siteSettings, vehicleMedia] = await Promise.all([getSiteSettings(), getManagedVehicleMedia()]);
  const vm = await buildHomePageViewModel(locale, { siteSettings, vehicleMedia });

  const mergedLinks = {
    kakao: siteSettings.contactLinks.kakao || SITE_KAKAO_CHAT_URL,
    instagram: siteSettings.contactLinks.instagram || SITE_INSTAGRAM_DM_URL,
    whatsapp: siteSettings.contactLinks.whatsapp || SITE_WHATSAPP_URL,
    line: siteSettings.contactLinks.line || SITE_LINE_URL,
    messenger: siteSettings.contactLinks.messenger || SITE_FACEBOOK_MESSENGER_URL,
  };

  return (
    <>
    <FaqJsonLd items={vm.faqItems} />
    <BespokeHomeExperience
      locale={locale}
      heroEyebrow={vm.heroEyebrow}
      heroTitle={vm.heroTitle}
      heroSlides={vm.heroSlides}
      heroSubtitle={vm.heroSubtitle}
      introEyebrow={vm.introEyebrow}
      introTitle={vm.introTitle}
      introDesc={vm.introDesc}
      vehicleEyebrow={vm.vehicleEyebrow}
      vehicleTitle={vm.vehicleTitle}
      vehicleDesc={vm.vehicleDesc}
      pricingEyebrow={vm.pricingEyebrow}
      pricingTitle={vm.pricingTitle}
      pricingTiers={vm.pricingTiers}
      bookingEyebrow={vm.bookingEyebrow}
      bookingTitle={vm.bookingTitle}
      bookingDesc={vm.bookingDesc}
      bookingCall={vm.bookingCall}
      bookingReview={vm.bookingReview}
      reviewEyebrow={vm.reviewEyebrow}
      reviewTitle={vm.reviewTitle}
      reviews={vm.reviews}
      aboutMeTitle={vm.aboutMeTitle}
      aboutMeDescription={vm.aboutMeDescription}
      galleryImageUrls={vm.galleryImageUrls}
      phoneTel={siteSettings.phoneTel || SITE_PHONE_TEL}
      contactLinks={mergedLinks}
      heroTitleOverride={vm.heroTitleOverride}
      heroSubtitleOverride={vm.heroSubtitleOverride}
      vehicleMainImages={vm.vehicleMainImages}
    />
    <HomeDestinationsLinks locale={locale} />
    <HomeFaqSection eyebrow={vm.faqEyebrow} title={vm.faqTitle} items={vm.faqItems} />
    </>
  );
}
