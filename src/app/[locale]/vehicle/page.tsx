import type { Metadata } from "next";
import { BespokeVehicleFleet } from "@/components/vehicle/BespokeVehicleFleet";
import { OnlineBookingCta } from "@/components/layout/OnlineBookingCta";
import { SubpageHero } from "@/components/layout/SubpageHero";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
import { getManagedVehicleMedia } from "@/lib/vehicle-media-store";
import { pickVehicleLocalized } from "@/lib/vehicle-page-content";
import { getManagedVehiclePageContent } from "@/lib/vehicle-page-content-store";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  return getLocalizedPageMetadata(params.locale, "vehicle");
}

export default async function VehiclePage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("HomePage.vehicle");
  const locale = (params.locale as "ko" | "en" | "ja" | "zh");
  const [media, content] = await Promise.all([
    getManagedVehicleMedia(),
    getManagedVehiclePageContent(),
  ]);

  return (
    <>
      <SubpageHero
        eyebrow={pickVehicleLocalized(content.sectionEyebrow, locale) || t("eyebrow")}
        title={pickVehicleLocalized(content.sectionTitle, locale) || t("title")}
        description={pickVehicleLocalized(content.sectionDesc, locale) || t("desc")}
      />
      <BespokeVehicleFleet media={media} content={content} locale={locale} />
      <OnlineBookingCta />
    </>
  );
}
