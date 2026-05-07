import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { LandingPageCopy } from "../../../data/landing-pages";

type Props = {
  locale: string;
  copy: LandingPageCopy;
  relatedLinks: Array<{ href: string; label: string }>;
  whatsappHref: string;
  kakaoHref: string;
  phoneTel: string;
  pricingSectionTitle: string;
  faqSectionTitle: string;
  ctaSectionTitle: string;
  relatedSectionTitle: string;
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
  whatsappHref,
  kakaoHref,
  phoneTel,
  pricingSectionTitle,
  faqSectionTitle,
  ctaSectionTitle,
  relatedSectionTitle,
}: Props) {
  return (
    <article className="mx-auto max-w-content px-4 py-10 md:px-6 md:py-14">
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

      <section
        className="mt-12 border-t border-white/10 pt-10"
        aria-labelledby="faq-heading"
      >
        <h2 id="faq-heading" className="text-xl font-semibold text-tone-sky md:text-2xl">
          {faqSectionTitle}
        </h2>
        <ul className="mt-6 space-y-6">
          {copy.faq.map((item) => (
            <li key={item.q}>
              <h3 className="text-base font-semibold text-white md:text-lg">{item.q}</h3>
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-white/75">{item.a}</p>
            </li>
          ))}
        </ul>
      </section>

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
    </article>
  );
}
