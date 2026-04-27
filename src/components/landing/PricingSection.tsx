import { getTranslations } from "next-intl/server";

const tiers = ["airport", "city", "charter"] as const;

export async function PricingSection() {
  const t = await getTranslations("HomePage.pricing");

  return (
    <section id="pricing" className="scroll-mt-24 border-b border-border/45 py-16 md:py-20">
      <div className="mx-auto max-w-content px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-tone-sky md:text-3xl">{t("title")}</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {tiers.map((tier) => (
            <article
              key={tier}
              className="rounded-xl border border-border/70 bg-surface/80 p-4"
            >
              <h3 className="text-sm font-semibold text-tone-strong">{t(`${tier}.label`)}</h3>
              <p className="mt-2 text-lg font-semibold text-brand-gold">{t(`${tier}.price`)}</p>
              <p className="mt-2 text-xs leading-relaxed text-tone-soft">{t(`${tier}.note`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}