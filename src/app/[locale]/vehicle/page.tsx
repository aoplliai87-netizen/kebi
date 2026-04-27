import { VehicleSection } from "@/components/landing/VehicleSection";
import { OnlineBookingCta } from "@/components/layout/OnlineBookingCta";
import { SubpageHero } from "@/components/layout/SubpageHero";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

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
      <VehicleSection />
      <OnlineBookingCta />
    </>
  );
}
