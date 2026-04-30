import type { Metadata } from "next";
import { ReviewSection } from "@/components/landing/ReviewSection";
import { OnlineBookingCta } from "@/components/layout/OnlineBookingCta";
import { SubpageHero } from "@/components/layout/SubpageHero";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
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

  return (
    <>
      <SubpageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("heroDesc")}
      />
      <ReviewSection />
      <OnlineBookingCta />
    </>
  );
}
