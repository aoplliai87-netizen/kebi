import type { Metadata } from "next";
import { BespokeBookingExperience } from "@/components/booking/BespokeBookingExperience";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  return getLocalizedPageMetadata(params.locale, "booking");
}

export default async function BookingPage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("HomePage.booking");

  return (
    <BespokeBookingExperience
      locale={params.locale}
      title={t("title")}
      description={t("desc")}
    />
  );
}
