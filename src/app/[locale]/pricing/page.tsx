import type { Metadata } from "next";
import { BespokePricingExperience } from "@/components/pricing/BespokePricingExperience";
import { getManagedPricingRegions } from "@/lib/pricing-table-store";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  return getLocalizedPageMetadata(params.locale, "pricing");
}

export default async function PricingPage({ params }: Props) {
  setRequestLocale(params.locale);
  const pricingRegions = await getManagedPricingRegions();

  return <BespokePricingExperience initialRegions={pricingRegions} />;
}
