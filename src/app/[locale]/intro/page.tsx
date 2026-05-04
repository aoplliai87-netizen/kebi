import type { Metadata } from "next";
import { BespokeIntroExperience } from "@/components/intro/BespokeIntroExperience";
import {
  INTRO_SERVICE_ALIGNS,
  INTRO_SERVICE_IMAGES,
} from "@/constants/introServices";
import { getLocalizedPageMetadata } from "@/lib/page-metadata";
import { SITE_PHONE_DISPLAY } from "@/lib/site";
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

  const services = SERVICE_IDS.map((id, i) => ({
    title: t(`services.${id}.title`),
    body: t(`services.${id}.body`),
    image: INTRO_SERVICE_IMAGES[i] ?? INTRO_SERVICE_IMAGES[0],
    align: INTRO_SERVICE_ALIGNS[i] ?? "left",
  }));

  return (
    <BespokeIntroExperience
      brandTitle={tHero("brandTitle")}
      sectionLabel={tHero("eyebrow")}
      headline={tHero("title")}
      description={tHero.rich("desc", {
        brand: (chunks) => (
          <span className="font-semibold text-brand-gold">{chunks}</span>
        ),
      })}
      coreValueEyebrow={t("coreValueEyebrow")}
      coreValueTitle={t("coreValueTitle")}
      coreValueBody={t("coreValueBody")}
      contactEyebrow={t("contactEyebrow")}
      representativeName={t("representativeName")}
      representativeLine={t("representativeLine")}
      phoneCaption={t("phoneCaption")}
      phoneDisplay={SITE_PHONE_DISPLAY}
      services={services}
    />
  );
}
