import type { Metadata } from "next";
import { BespokeBookingExperience } from "@/components/booking/BespokeBookingExperience";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
import { getSiteSettings } from "@/lib/site-settings-store";
import { pickSubpageLocalized } from "@/lib/subpages-content";
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
  const siteSettings = await getSiteSettings();
  const localeKey = params.locale as "ko" | "en" | "ja" | "zh";
  const bookingCms = siteSettings.subpages.booking;

  return (
    <BespokeBookingExperience
      locale={params.locale}
      title={pickSubpageLocalized(bookingCms.title, localeKey) || t("title")}
      description={pickSubpageLocalized(bookingCms.description, localeKey) || t("desc")}
    />
  );
}
