import type { Metadata } from "next";
import { BespokeVehicleFleet } from "@/components/vehicle/BespokeVehicleFleet";
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
  return getLocalizedPageMetadata(params.locale, "vehicle");
}

export default async function VehiclePage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("HomePage.vehicle");

  return (
    <>
      <SubpageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("desc")}
      />
      <BespokeVehicleFleet />
      <OnlineBookingCta />
    </>
  );
}
