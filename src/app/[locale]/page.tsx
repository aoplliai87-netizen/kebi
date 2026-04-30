import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BespokeHomeExperience } from "@/components/home/BespokeHomeExperience";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  return getLocalizedPageMetadata(params.locale, "home");
}

export default async function HomePage({ params }: Props) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");

  return (
    <BespokeHomeExperience
      heroEyebrow={t("heroEyebrow")}
      heroTitle={t("heroTitle")}
      heroSubtitle={t.rich("heroSubtitle", {
        brand: (chunks) => (
          <span className="font-semibold text-brand-gold [font-size:1.28em] leading-snug tracking-tight drop-shadow-[0_0_24px_rgba(212,175,55,0.2)]">
            {chunks}
          </span>
        ),
      })}
      introEyebrow={t("intro.eyebrow")}
      introTitle={t("intro.title")}
      introDesc={t.rich("intro.desc", {
        brand: (chunks) => (
          <span className="font-semibold text-brand-gold">{chunks}</span>
        ),
      })}
      vehicleEyebrow={t("vehicle.eyebrow")}
      vehicleTitle={t("vehicle.cardTitle")}
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
