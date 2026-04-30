import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BespokeSupportExperience } from "@/components/support/BespokeSupportExperience";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return getLocalizedPageMetadata(params.locale, "inquiry");
}

export default async function InquiryPage({ params }: Props) {
  setRequestLocale(params.locale);
  return <BespokeSupportExperience />;
}
