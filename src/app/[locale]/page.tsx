import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export default async function HomePage({ params }: Props) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-content flex-col justify-center px-4 py-16">
      <div id="booking" className="scroll-mt-28">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 max-w-xl text-muted">{t("heroSubtitle")}</p>
      </div>
    </div>
  );
}
