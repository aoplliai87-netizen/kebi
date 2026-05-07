import type { Metadata } from "next";
import { BespokeIntroExperience } from "@/components/intro/BespokeIntroExperience";
import {
  INTRO_SERVICE_ALIGNS,
  INTRO_SERVICE_IMAGES,
} from "@/constants/introServices";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
import { renderIntroBrandMarkup } from "@/lib/render-brand-markup";
import { getSiteSettings } from "@/lib/site-settings-store";
import { SITE_PHONE_DISPLAY } from "@/lib/site";
import { pickSubpageLocalized } from "@/lib/subpages-content";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

const SERVICE_IDS = ["s01", "s02", "s03", "s04"] as const;

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  return getLocalizedPageMetadata(params.locale, "intro");
}

export default async function IntroPage({ params }: Props) {
  setRequestLocale(params.locale);
  const tHero = await getTranslations("IntroPage.hero");
  const t = await getTranslations("IntroPage");
  const siteSettings = await getSiteSettings();
  const localeKey = params.locale as "ko" | "en" | "ja" | "zh";
  const introCms = siteSettings.subpages.intro;

  const services = SERVICE_IDS.map((id, i) => ({
    title:
      pickSubpageLocalized(introCms.services[i].title, localeKey) ||
      t(`services.${id}.title`),
    body:
      pickSubpageLocalized(introCms.services[i].body, localeKey) ||
      t(`services.${id}.body`),
    image:
      introCms.services[i].image ||
      INTRO_SERVICE_IMAGES[i] ||
      INTRO_SERVICE_IMAGES[0],
    align: INTRO_SERVICE_ALIGNS[i] ?? "left",
  }));
  const descriptionOverride = pickSubpageLocalized(introCms.description, localeKey);

  return (
    <BespokeIntroExperience
      brandTitle={pickSubpageLocalized(introCms.brandTitle, localeKey) || tHero("brandTitle")}
      sectionLabel={pickSubpageLocalized(introCms.sectionLabel, localeKey) || tHero("eyebrow")}
      headline={pickSubpageLocalized(introCms.headline, localeKey) || tHero("title")}
      description={
        descriptionOverride
          ? renderIntroBrandMarkup(descriptionOverride)
          : tHero.rich("desc", {
              brand: (chunks) => (
                <span className="font-semibold text-brand-gold">{chunks}</span>
              ),
            })
      }
      coreValueEyebrow={pickSubpageLocalized(introCms.coreValueEyebrow, localeKey) || t("coreValueEyebrow")}
      coreValueTitle={pickSubpageLocalized(introCms.coreValueTitle, localeKey) || t("coreValueTitle")}
      coreValueBody={pickSubpageLocalized(introCms.coreValueBody, localeKey) || t("coreValueBody")}
      contactEyebrow={pickSubpageLocalized(introCms.contactEyebrow, localeKey) || t("contactEyebrow")}
      representativeName={pickSubpageLocalized(introCms.representativeName, localeKey) || t("representativeName")}
      representativeLine={pickSubpageLocalized(introCms.representativeLine, localeKey) || t("representativeLine")}
      phoneCaption={pickSubpageLocalized(introCms.phoneCaption, localeKey) || t("phoneCaption")}
      phoneDisplay={SITE_PHONE_DISPLAY}
      services={services}
    />
  );
}
