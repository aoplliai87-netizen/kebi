import { getTranslations } from "next-intl/server";
import { PlaceholderImage } from "./PlaceholderImage";

export async function VehicleSection() {
  const t = await getTranslations("HomePage.vehicle");

  return (
    <section id="vehicle" className="scroll-mt-24 border-b border-border/45 py-16 md:py-20">
      <div className="mx-auto grid max-w-content gap-6 px-4 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-tone-sky md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-tone-body md:text-base">{t("desc")}</p>
        </div>
        <PlaceholderImage
          aspect="wide"
          aria-label={t("imageAlt")}
          className="rounded-xl border-border/70 bg-gradient-to-br from-brand-deep-soft/70 to-surface"
        />
      </div>
    </section>
  );
}