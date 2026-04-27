import { ReviewSection } from "@/components/landing/ReviewSection";
import { OnlineBookingCta } from "@/components/layout/OnlineBookingCta";
import { SubpageHero } from "@/components/layout/SubpageHero";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export default async function ReviewPage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("HomePage.review");

  return (
    <>
      <SubpageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("one.content")}
      />
      <ReviewSection />
      <OnlineBookingCta />
    </>
  );
}
