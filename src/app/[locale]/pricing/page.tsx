import { BespokePricingExperience } from "@/components/pricing/BespokePricingExperience";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export default async function PricingPage({ params }: Props) {
  setRequestLocale(params.locale);

  return <BespokePricingExperience />;
}
