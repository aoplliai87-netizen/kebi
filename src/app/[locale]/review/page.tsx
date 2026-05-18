import type { Metadata } from "next";
import { GoogleReviewCta } from "@/components/review/GoogleReviewCta";
import { BespokeReviewExperience } from "@/components/review/BespokeReviewExperience";
import { OnlineBookingCta } from "@/components/layout/OnlineBookingCta";
import { SubpageHero } from "@/components/layout/SubpageHero";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
import { getSiteSettings } from "@/lib/site-settings-store";
import { pickLocalized } from "@/lib/home-sections";
import { pickSubpageLocalized } from "@/lib/subpages-content";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  return getLocalizedPageMetadata(params.locale, "review");
}

export default async function ReviewPage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("HomePage.review");
  const siteSettings = await getSiteSettings();
  const localeKey = params.locale as "ko" | "en" | "ja" | "zh";
  const reviewCms = siteSettings.subpages.review;
  const homeReviews = siteSettings.home.reviews;
  const reviewRows = [
    {
      content: pickLocalized(homeReviews.one.content, localeKey),
      author: pickLocalized(homeReviews.one.author, localeKey),
    },
    {
      content: pickLocalized(homeReviews.two.content, localeKey),
      author: pickLocalized(homeReviews.two.author, localeKey),
    },
    {
      content: pickLocalized(homeReviews.three.content, localeKey),
      author: pickLocalized(homeReviews.three.author, localeKey),
    },
  ];
  const showSampleRows = reviewRows.every((r) => r.content.trim() && r.author.trim());

  return (
    <>
      <SubpageHero
        eyebrow={pickSubpageLocalized(reviewCms.heroEyebrow, localeKey) || t("eyebrow")}
        title={pickSubpageLocalized(reviewCms.heroTitle, localeKey) || t("title")}
        description={pickSubpageLocalized(reviewCms.heroDesc, localeKey) || t("heroDesc")}
      />
      <GoogleReviewCta locale={params.locale} />
      <BespokeReviewExperience sampleReviews={showSampleRows ? reviewRows : []} />
      <OnlineBookingCta />
    </>
  );
}
