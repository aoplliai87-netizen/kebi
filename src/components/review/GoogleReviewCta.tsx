import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/Button";

function trimUrl(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t && t.startsWith("https://") ? t : undefined;
}

type Props = {
  locale: string;
};

/**
 * /review 상단 — NEXT_PUBLIC_GOOGLE_REVIEW_URL / NEXT_PUBLIC_GOOGLE_BUSINESS_URL 이 있을 때만 표시.
 * 버튼은 각 URL이 있을 때만 노출.
 */
export async function GoogleReviewCta({ locale }: Props) {
  const reviewUrl = trimUrl(process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL);
  const mapsUrl = trimUrl(process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL);

  if (!reviewUrl && !mapsUrl) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "ReviewBoard" });

  return (
    <section className="border-b border-border/45 bg-black/20 py-10 md:py-12">
      <div className="mx-auto max-w-content px-4 md:px-6">
        <div className="rounded-2xl border border-metal-bronze/25 bg-gradient-to-br from-brand-deep/50 to-surface/90 p-6 md:p-8">
          <h2 className="font-sans text-xl font-bold tracking-tight text-tone-sky md:text-2xl">{t("googleTitle")}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-tone-body md:text-base">{t("googleDescription")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {reviewUrl ? (
              <a href={reviewUrl} target="_blank" rel="noopener noreferrer">
                <Button className="h-11 rounded-xl px-6 text-sm font-semibold">{t("googleReviewBtn")}</Button>
              </a>
            ) : null}
            {mapsUrl ? (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="h-11 rounded-xl border-metal-bronze/45 px-6 text-sm font-semibold text-tone-sky"
                >
                  {t("googleMapsBtn")}
                </Button>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
