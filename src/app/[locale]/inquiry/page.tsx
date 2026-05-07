import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BespokeSupportExperience } from "@/components/support/BespokeSupportExperience";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
import { getSiteSettings } from "@/lib/site-settings-store";
import { pickSubpageLocalized } from "@/lib/subpages-content";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return getLocalizedPageMetadata(params.locale, "inquiry");
}

export default async function InquiryPage({ params }: Props) {
  setRequestLocale(params.locale);
  const siteSettings = await getSiteSettings();
  const localeKey = params.locale as "ko" | "en" | "ja" | "zh";
  const inquiryCms = siteSettings.subpages.inquiry;
  return (
    <BespokeSupportExperience
      contentOverrides={{
        heroEyebrow: pickSubpageLocalized(inquiryCms.heroEyebrow, localeKey),
        heroTitle: pickSubpageLocalized(inquiryCms.heroTitle, localeKey),
        heroDesc: pickSubpageLocalized(inquiryCms.heroDesc, localeKey),
        faqTitle: pickSubpageLocalized(inquiryCms.faqTitle, localeKey),
        faqQ1: pickSubpageLocalized(inquiryCms.faqItems[0].q, localeKey),
        faqA1: pickSubpageLocalized(inquiryCms.faqItems[0].a, localeKey),
        faqQ2: pickSubpageLocalized(inquiryCms.faqItems[1].q, localeKey),
        faqA2: pickSubpageLocalized(inquiryCms.faqItems[1].a, localeKey),
        faqQ3: pickSubpageLocalized(inquiryCms.faqItems[2].q, localeKey),
        faqA3: pickSubpageLocalized(inquiryCms.faqItems[2].a, localeKey),
        faqQ4: pickSubpageLocalized(inquiryCms.faqItems[3].q, localeKey),
        faqA4: pickSubpageLocalized(inquiryCms.faqItems[3].a, localeKey),
        faqQ5: pickSubpageLocalized(inquiryCms.faqItems[4].q, localeKey),
        faqA5: pickSubpageLocalized(inquiryCms.faqItems[4].a, localeKey),
        formTitle: pickSubpageLocalized(inquiryCms.formTitle, localeKey),
        formDesc: pickSubpageLocalized(inquiryCms.formDesc, localeKey),
        contactSectionTitle: pickSubpageLocalized(inquiryCms.contactSectionTitle, localeKey),
        contactSectionDesc: pickSubpageLocalized(inquiryCms.contactSectionDesc, localeKey),
      }}
    />
  );
}
