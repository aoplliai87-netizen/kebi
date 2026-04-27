import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { SITE_PHONE_TEL } from "@/lib/site";

export async function BookingSection() {
  const t = await getTranslations("HomePage.booking");

  return (
    <section id="booking" className="scroll-mt-24 border-b border-border/45 py-16 md:py-20">
      <div className="mx-auto max-w-content px-4">
        <div className="rounded-2xl border border-brand-gold/20 bg-gradient-to-r from-brand-deep/75 to-surface p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-tone-sky md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-tone-body md:text-base">
            {t("desc")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={SITE_PHONE_TEL}>
              <Button className="h-10 rounded-lg px-4 text-sm">{t("ctaCall")}</Button>
            </a>
            <a href="#review">
              <Button variant="outline" className="h-10 rounded-lg border-white/25 px-4 text-sm text-primary-foreground">
                {t("ctaReview")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}