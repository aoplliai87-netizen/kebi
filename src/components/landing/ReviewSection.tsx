import { getTranslations } from "next-intl/server";

const reviews = ["one", "two", "three"] as const;

export async function ReviewSection() {
  const t = await getTranslations("HomePage.review");

  return (
    <section id="review" className="scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto max-w-content px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-tone-sky md:text-3xl">{t("title")}</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {reviews.map((key) => (
            <blockquote
              key={key}
              className="rounded-xl border border-border/70 bg-surface/80 p-4 text-sm leading-relaxed text-tone-body"
            >
              <p>{t(`${key}.content`)}</p>
              <footer className="mt-4 text-xs font-semibold text-tone-strong">
                {t(`${key}.author`)}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}