import { getTranslations, setRequestLocale } from "next-intl/server";
import { BespokeHomeExperience } from "@/components/home/BespokeHomeExperience";

type Props = {
  params: { locale: string };
};

export default async function HomePage({ params }: Props) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");

  return (
    <BespokeHomeExperience
      heroEyebrow={t("heroEyebrow")}
      heroTitle={t("heroTitle")}
      heroSubtitle={t("heroSubtitle")}
      introEyebrow={t("intro.eyebrow")}
      introTitle={t("intro.title")}
      introDesc={t("intro.desc")}
      vehicleEyebrow={t("vehicle.eyebrow")}
      vehicleTitle={t("vehicle.title")}
      vehicleDesc={t("vehicle.desc")}
      pricingEyebrow={t("pricing.eyebrow")}
      pricingTitle={t("pricing.title")}
      pricingTiers={[
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
      ]}
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
    />
  );
}
