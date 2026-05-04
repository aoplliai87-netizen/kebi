import { getTranslations } from "next-intl/server";

export async function IntroSection() {
  const t = await getTranslations("IntroPage.hero");

  return (
    <section
      id="intro"
      className="scroll-mt-24 border-b border-border/45 py-16 md:py-24"
    >
      <div className="mx-auto max-w-content px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-border/70 bg-surface/80 p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-tone-sky md:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-tone-body md:text-base">
              {t.rich("desc", {
                brand: (chunks) => (
                  <span className="font-semibold text-brand-gold">{chunks}</span>
                ),
              })}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                <p className="text-[11px] font-semibold tracking-wide text-brand-gold">
                  01
                </p>
                <p className="mt-2 text-sm text-tone-strong">Punctual Service</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                <p className="text-[11px] font-semibold tracking-wide text-brand-gold">
                  02
                </p>
                <p className="mt-2 text-sm text-tone-strong">Consistent Quality</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                <p className="text-[11px] font-semibold tracking-wide text-brand-gold">
                  03
                </p>
                <p className="mt-2 text-sm text-tone-strong">Direct Communication</p>
              </div>
            </div>
          </article>

          <aside className="rounded-2xl border border-brand-gold/20 bg-gradient-to-b from-brand-deep/70 to-surface p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold/90">
              Premium Notes
            </p>
            <p className="mt-3 text-sm leading-relaxed text-tone-body md:text-base">
              {t.rich("desc", {
                brand: (chunks) => (
                  <span className="font-semibold text-brand-gold">{chunks}</span>
                ),
              })}
            </p>
            <div className="mt-6 h-px bg-border/70" />
            <p className="mt-6 text-sm leading-relaxed text-tone-soft">
              Incheon Airport routes are managed with a single quality standard from inquiry to arrival.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}