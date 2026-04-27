import { BespokeIntroExperience } from "@/components/intro/BespokeIntroExperience";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export default async function IntroPage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations("HomePage.intro");

  return (
    <BespokeIntroExperience
      sectionLabel={t("eyebrow")}
      headline={t("title")}
      description={t("desc")}
    />
  );
}
