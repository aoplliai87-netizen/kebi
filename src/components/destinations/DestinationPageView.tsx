import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { LandingPageCopy } from "../../../data/landing-pages";

type Props = {
  locale: string;
  copy: LandingPageCopy;
  relatedLinks: Array<{ href: string; label: string }>;
  /** 그래프 기반 “함께 많이 찾는 구간” — 비어 있으면 미표시 */
  popularLinks?: Array<{ href: string; label: string }>;
  recommendedLinks?: Array<{ href: string; label: string }>;
  northGyeonggiLinks?: Array<{ href: string; label: string }>;
  whatsappHref: string;
  kakaoHref: string;
  phoneTel: string;
  pricingSectionTitle: string;
  faqSectionTitle: string;
  ctaSectionTitle: string;
  relatedSectionTitle: string;
  popularSectionTitle: string;
  recommendedSectionTitle: string;
  northGyeonggiSectionTitle: string;
  operationalTipsSectionTitle: string;
  scenarioExamplesSectionTitle: string;
  poiSectionEyebrow: string;
  poiSectionTitle: string;
  poiTagsTitle: string;
  poiHotelsTitle: string;
  poiLandmarksTitle: string;
  poiDropoffTitle: string;
};

const SECONDARY_PATH = "/pricing" as const;

function formatPhoneDisplay(locale: string, phoneTel: string): string {
  const digits = phoneTel.replace(/[^\d+]/g, "");
  if (locale !== "ko") return digits.replace(/^\+/, "+");

  const normalized = digits.startsWith("+82") ? `0${digits.slice(3)}` : digits;
  if (/^01\d{8,9}$/.test(normalized)) {
    const second = normalized.length === 10 ? 3 : 4;
    const firstPart = normalized.slice(0, 3);
    const secondPart = normalized.slice(3, 3 + second);
    const thirdPart = normalized.slice(3 + second);
    return `${firstPart}-${secondPart}-${thirdPart}`;
  }
  return normalized;
}

export function DestinationPageView({
  locale,
  copy,
  relatedLinks,
  popularLinks = [],
  recommendedLinks = [],
  northGyeonggiLinks = [],
  whatsappHref,
  kakaoHref,
  phoneTel,
  pricingSectionTitle,
  faqSectionTitle,
  ctaSectionTitle,
  relatedSectionTitle,
  popularSectionTitle,
  recommendedSectionTitle,
  northGyeonggiSectionTitle,
  operationalTipsSectionTitle,
  scenarioExamplesSectionTitle,
  poiSectionEyebrow,
  poiSectionTitle,
  poiTagsTitle,
  poiHotelsTitle,
  poiLandmarksTitle,
  poiDropoffTitle,
}: Props) {
  return (
    <article className="relative mx-auto max-w-content px-4 pb-28 pt-10 md:px-6 md:pb-14 md:pt-14">
      <nav aria-label="Breadcrumb" className="text-sm text-white/60">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="underline-offset-4 hover:text-white hover:underline">
              {copy.homeLinkLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-white/80">{copy.h1}</li>
        </ol>
      </nav>

      <header className="mt-8">
        <h1 className="font-sans text-3xl font-bold leading-tight tracking-tight text-tone-sky md:text-4xl lg:text-[2.5rem]">
          {copy.h1}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
          {copy.lede}
        </p>
        {copy.travelTraitsLine?.trim() ? (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60">{copy.travelTraitsLine}</p>
        ) : null}
      </header>

      <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <Image
          src={copy.hero.src}
          alt={copy.hero.alt}
          width={copy.hero.width}
          height={copy.hero.height}
          sizes="(max-width: 768px) 100vw, 896px"
          className="h-auto w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      {copy.trustPhotoNote?.trim() ? (
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-white/45 md:text-sm">{copy.trustPhotoNote}</p>
      ) : null}

      {copy.vehicleRecommendBlurb?.trim() ? (
        <aside className="mt-8 rounded-2xl border border-brand-gold/25 bg-brand-gold/[0.06] px-5 py-4 text-sm leading-relaxed text-white/85 md:text-base">
          {copy.vehicleRecommendBlurb}
        </aside>
      ) : null}

      {copy.destinationPoi &&
      (copy.destinationPoi.nearbyHotels.length > 0 ||
        copy.destinationPoi.nearbyLandmarks.length > 0 ||
        copy.destinationPoi.popularDestinationTags.length > 0 ||
        copy.destinationPoi.recommendedDropoff.trim()) ? (
        <section
          className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 md:mt-10 md:px-7 md:py-7"
          aria-labelledby="destination-poi-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold/90">{poiSectionEyebrow}</p>
          <h2 id="destination-poi-heading" className="mt-2 text-lg font-semibold text-white md:text-xl">
            {poiSectionTitle}
          </h2>
          {copy.destinationPoi.popularDestinationTags.length > 0 ? (
            <>
              <p className="mt-3 text-sm text-white/55">{poiTagsTitle}</p>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label={poiTagsTitle}>
              {copy.destinationPoi.popularDestinationTags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-medium text-white/85 md:text-sm"
                >
                  {tag}
                </li>
              ))}
              </ul>
            </>
          ) : null}

          {copy.destinationPoi.nearbyHotels.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-base font-semibold text-tone-sky md:text-lg">{poiHotelsTitle}</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-white/78 md:grid-cols-2 md:text-[15px]">
                {copy.destinationPoi.nearbyHotels.map((name) => (
                  <li key={name} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-gold/70" aria-hidden />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {copy.destinationPoi.nearbyLandmarks.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-base font-semibold text-tone-sky md:text-lg">{poiLandmarksTitle}</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-white/78 md:grid-cols-2 md:text-[15px]">
                {copy.destinationPoi.nearbyLandmarks.map((name) => (
                  <li key={name} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/35" aria-hidden />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {copy.destinationPoi.recommendedDropoff.trim() ? (
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-base font-semibold text-tone-sky md:text-lg">{poiDropoffTitle}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/72 md:text-[15px]">
                {copy.destinationPoi.recommendedDropoff}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      {copy.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mt-12 border-t border-white/10 pt-10"
          aria-labelledby={`${section.id}-heading`}
        >
          <h2
            id={`${section.id}-heading`}
            className="text-xl font-semibold text-tone-sky md:text-2xl"
          >
            {section.heading}
          </h2>
          <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-relaxed text-white/80">
            {section.body}
          </p>
        </section>
      ))}

      <section
        className="mt-12 border-t border-white/10 pt-10"
        aria-labelledby="pricing-heading"
      >
        <h2 id="pricing-heading" className="text-xl font-semibold text-tone-sky md:text-2xl">
          {pricingSectionTitle}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80">
          {copy.pricingIntro}
        </p>
        <ul className="mt-6 space-y-4">
          {copy.pricingItems.map((item) => (
            <li
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <p className="font-medium text-white">{item.label}</p>
              <p className="mt-1 text-brand-gold">{item.price}</p>
              {item.note ? (
                <p className="mt-1 text-sm text-white/65">{item.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {copy.operationalTips && copy.operationalTips.length > 0 ? (
        <section
          className="mt-12 border-t border-white/10 pt-10"
          aria-labelledby="operational-tips-heading"
        >
          <h2 id="operational-tips-heading" className="text-xl font-semibold text-tone-sky md:text-2xl">
            {operationalTipsSectionTitle}
          </h2>
          <ul className="mt-6 space-y-5">
            {copy.operationalTips.map((tip, idx) => (
              <li key={`${tip.label}-${idx}`} className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
                <h3 className="text-[15px] font-semibold text-white md:text-base">{tip.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/72 md:text-[15px]">{tip.body}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section
        className="mt-12 border-t border-white/10 pt-10"
        aria-labelledby="faq-heading"
      >
        <h2 id="faq-heading" className="text-xl font-semibold text-tone-sky md:text-2xl">
          {faqSectionTitle}
        </h2>
        <ul className="mt-6 space-y-6">
          {copy.faq.map((item) => (
            <li key={item.q} className="scroll-mt-20">
              <h3 className="text-base font-semibold text-white md:text-lg">{item.q}</h3>
              <p className="mt-2 max-w-3xl text-base leading-[1.65] text-white/75 text-pretty md:leading-relaxed">
                {item.a}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {copy.scenarioExamples && copy.scenarioExamples.length > 0 ? (
        <section
          className="mt-12 border-t border-white/10 pt-10"
          aria-labelledby="scenario-examples-heading"
        >
          <h2 id="scenario-examples-heading" className="text-xl font-semibold text-tone-sky md:text-2xl">
            {scenarioExamplesSectionTitle}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            {copy.scenarioExamples.map((ex, idx) => (
              <li
                key={`${ex.title}-${idx}`}
                className="flex flex-col rounded-xl border border-brand-gold/20 bg-brand-gold/[0.04] px-4 py-4 md:min-h-[11rem]"
              >
                <p className="text-[15px] font-semibold leading-snug text-white">{ex.title}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{ex.body}</p>
              </li>
            ))}
          </ul>
          {copy.scenarioDisclaimer?.trim() ? (
            <p className="mt-4 text-xs leading-relaxed text-white/45 md:text-sm">{copy.scenarioDisclaimer}</p>
          ) : null}
        </section>
      ) : null}

      <section
        className="mt-12 rounded-2xl border border-brand-gold/25 bg-brand-deep/40 px-6 py-8 md:px-8"
        aria-labelledby="cta-heading"
      >
        <h2 id="cta-heading" className="text-lg font-semibold text-tone-sky md:text-xl">
          {ctaSectionTitle}
        </h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={copy.bookingPathLabel}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-gold px-6 text-[15px] font-semibold text-accent-foreground shadow-sm hover:brightness-110"
          >
            {copy.primaryCtaLabel}
          </Link>
          <Link
            href={SECONDARY_PATH}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-transparent px-6 text-[15px] font-medium text-white hover:bg-white/5"
          >
            {copy.secondaryCtaLabel}
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-[15px] font-medium text-white hover:bg-white/10"
          >
            {copy.whatsappCtaLabel}
          </a>
          <a
            href={kakaoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-[15px] font-medium text-white hover:bg-white/10"
          >
            {copy.kakaoCtaLabel}
          </a>
          <a
            href={phoneTel}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-[15px] font-medium text-white hover:bg-white/10"
          >
            {formatPhoneDisplay(locale, phoneTel)}
          </a>
        </div>
      </section>

      {relatedLinks.length > 0 ? (
        <section className="mt-12 border-t border-white/10 pt-10" aria-labelledby="related-links-heading">
          <h2 id="related-links-heading" className="text-xl font-semibold text-tone-sky md:text-2xl">
            {relatedSectionTitle}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {relatedLinks.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="flex min-h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-4 text-center text-[15px] font-medium text-white/90 hover:bg-white/[0.06]"
                >
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {popularLinks.length > 0 ? (
        <section className="mt-12 border-t border-white/10 pt-10" aria-labelledby="popular-links-heading">
          <h2 id="popular-links-heading" className="text-xl font-semibold text-tone-sky md:text-2xl">
            {popularSectionTitle}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {popularLinks.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="flex min-h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-4 text-center text-[15px] font-medium text-white/90 hover:bg-white/[0.06]"
                >
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recommendedLinks.length > 0 ? (
        <section className="mt-12 border-t border-white/10 pt-10" aria-labelledby="recommended-links-heading">
          <h2 id="recommended-links-heading" className="text-xl font-semibold text-tone-sky md:text-2xl">
            {recommendedSectionTitle}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {recommendedLinks.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="flex min-h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-4 text-center text-[15px] font-medium text-white/90 hover:bg-white/[0.06]"
                >
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {northGyeonggiLinks.length > 0 ? (
        <section className="mt-12 border-t border-white/10 pt-10" aria-labelledby="north-gyeonggi-links-heading">
          <h2 id="north-gyeonggi-links-heading" className="text-xl font-semibold text-tone-sky md:text-2xl">
            {northGyeonggiSectionTitle}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {northGyeonggiLinks.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="flex min-h-12 items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-4 text-center text-[15px] font-medium text-white/90 hover:bg-white/[0.06]"
                >
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 px-3 py-2.5 shadow-[0_-10px_28px_rgba(0,0,0,0.45)] backdrop-blur-md md:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto mx-auto flex max-w-content justify-center">
          <Link
            href={copy.bookingPathLabel}
            className="inline-flex min-h-11 w-full max-w-md items-center justify-center rounded-xl bg-brand-gold px-4 text-[15px] font-semibold text-accent-foreground shadow-md hover:brightness-110"
          >
            {copy.primaryCtaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
