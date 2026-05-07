import { NextIntlClientProvider } from "next-intl";
import { BespokeHomeExperience } from "@/components/home/BespokeHomeExperience";
import { HomeDestinationsLinks } from "@/components/home/HomeDestinationsLinks";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { buildHomePageViewModel } from "@/lib/home-page-view-model";
import type { SiteSettings } from "@/lib/site-settings-store";
import type { ManagedVehicleMedia } from "@/lib/vehicle-media-types";
import { AdminHomePreviewOverlay } from "@/components/admin/AdminHomePreviewOverlay";
import { SITE_PHONE_TEL } from "@/lib/site";

type Props = {
  locale: "ko" | "en" | "ja" | "zh";
  siteSettings: SiteSettings;
  vehicleMedia: ManagedVehicleMedia;
  mergedContact: {
    kakao: string;
    instagram: string;
    whatsapp: string;
    line: string;
    messenger: string;
  };
};

async function loadMessages(locale: "ko" | "en" | "ja" | "zh") {
  const mod = await import(`../../../messages/${locale}.json`);
  return mod.default;
}

export async function AdminHomeLivePreview({
  locale,
  siteSettings,
  vehicleMedia,
  mergedContact,
}: Props) {
  const [messages, vm] = await Promise.all([
    loadMessages(locale),
    buildHomePageViewModel(locale, { siteSettings, vehicleMedia }),
  ]);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#050a11]">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-2">
        <h2 className="text-sm font-semibold text-tone-strong">실제 공개 홈 렌더 미리보기 ({locale.toUpperCase()})</h2>
      </div>
      <div className="relative">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <BespokeHomeExperience
            locale={locale}
            heroEyebrow={vm.heroEyebrow}
            heroTitle={vm.heroTitle}
            heroSubtitle={vm.heroSubtitle}
            heroSlides={vm.heroSlides}
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
            contactLinks={mergedContact}
            heroTitleOverride={vm.heroTitleOverride}
            heroSubtitleOverride={vm.heroSubtitleOverride}
            vehicleMainImages={vm.vehicleMainImages}
          />
          <HomeDestinationsLinks locale={locale} />
          <HomeFaqSection eyebrow={vm.faqEyebrow} title={vm.faqTitle} items={vm.faqItems} />
        </NextIntlClientProvider>
        <AdminHomePreviewOverlay locale={locale} />
      </div>
    </section>
  );
}
