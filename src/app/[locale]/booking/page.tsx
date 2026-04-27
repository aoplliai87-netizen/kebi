import { BespokeBookingExperience } from "@/components/booking/BespokeBookingExperience";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

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
