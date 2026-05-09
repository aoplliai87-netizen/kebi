"use client";

import { Link } from "@/i18n/navigation";

export type HomeDestinationButtonVm = {
  label: string;
  href: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  buttons: HomeDestinationButtonVm[];
  footerLabel: string;
  footerHref: string;
};

export function HomeDestinationsLinks({
  eyebrow,
  title,
  description,
  buttons,
  footerLabel,
  footerHref,
}: Props) {
  const safeButtons = buttons.slice(0, 3);

  return (
    <section
      className="mx-auto max-w-content px-4 py-16 md:px-6"
      aria-labelledby="home-destinations-title"
      data-home-section="destinations"
    >
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-metal-bronze-strong md:text-[13px]">
          {eyebrow}
        </p>
        <h2
          id="home-destinations-title"
          className="mt-3 font-sans text-2xl font-bold tracking-[-0.02em] text-tone-sky md:text-3xl"
        >
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-white/70 md:text-base">
          {description}
        </p>
      </div>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {safeButtons.map((btn, idx) => (
          <li key={`${btn.href}-${idx}`}>
            <Link
              href={btn.href}
              className="flex min-h-[3.25rem] items-center justify-center rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-center text-sm font-medium text-white/90 transition hover:border-brand-gold/35 hover:bg-white/[0.06] md:text-base"
            >
              {btn.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-sm text-white/55">
        <Link href={footerHref} className="text-brand-gold underline-offset-4 hover:underline">
          {footerLabel}
        </Link>
      </p>
    </section>
  );
}
