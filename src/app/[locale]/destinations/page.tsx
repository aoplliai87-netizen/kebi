import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { buildDestinationsIndexMetadata } from "@/lib/seo";
import { parseKeywordsInput, pickLocaleText } from "@/lib/seo-settings";
import { getSiteSettings } from "@/lib/site-settings-store";
import {
  HUB_CATEGORY_ORDER,
  bucketDestinationSlugs,
  type HubCategoryId,
} from "../../../../data/destination-hub-categories";
import {
  getAllDestinationSlugs,
  getCopyForLocale,
  getLandingPageBySlug,
} from "../../../../data/landing-pages";

type Props = {
  params: { locale: string };
};

const CATEGORY_LABEL_KEY: Record<HubCategoryId, string> = {
  popular: "hubCategoryPopular",
  foreign_vip: "hubCategoryForeignVip",
  gyeonggi_north: "hubCategoryGyeonggiNorth",
  family_theme: "hubCategoryFamilyTheme",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const settings = await getSiteSettings();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const localeKey = locale as "ko" | "en" | "ja" | "zh";
  const hub = settings.seo.destinations;
  const siteName = t("siteName");
  const fallbackTitle = t("pages.destinationsHub.title");
  const fallbackDescription = t("pages.destinationsHub.description");
  const titleBase = pickLocaleText(hub.metaTitle, localeKey) || fallbackTitle;
  const title = titleBase.includes(siteName) ? titleBase : `${titleBase} | ${siteName}`;
  const description = pickLocaleText(hub.metaDescription, localeKey) || fallbackDescription;

  return buildDestinationsIndexMetadata({
    locale,
    title,
    description,
    siteName,
    canonicalOverride: pickLocaleText(hub.canonicalUrl, localeKey),
    ogTitleOverride: pickLocaleText(hub.ogTitle, localeKey),
    ogDescriptionOverride: pickLocaleText(hub.ogDescription, localeKey),
    ogImageOverride: hub.ogImage,
    keywordsOverride: parseKeywordsInput(pickLocaleText(hub.focusKeywords, localeKey)),
  });
}

function DestinationCard({
  slug,
  locale,
  siteName,
}: {
  slug: string;
  locale: string;
  siteName: string;
}) {
  const page = getLandingPageBySlug(slug);
  if (!page) return null;
  const copy = getCopyForLocale(page, locale);
  const label = copy.linkTitle ?? slug;
  const lede = copy.lede ?? "";

  return (
    <li key={slug}>
      <Link
        href={`/destinations/${slug}`}
        className="flex min-h-0 flex-col rounded-2xl border border-white/12 bg-white/[0.03] p-4 transition hover:border-brand-gold/35 hover:bg-white/[0.06] md:p-5"
      >
        <span className="text-[15px] font-semibold leading-snug text-white/95 md:text-base">{label}</span>
        {lede ? (
          <span className="mt-2 line-clamp-2 text-[13px] leading-snug text-white/58 md:line-clamp-3 md:text-sm md:leading-relaxed">
            {lede}
          </span>
        ) : null}
        <span className="mt-3 text-[11px] font-medium text-brand-gold md:mt-4 md:text-xs">{siteName}</span>
      </Link>
    </li>
  );
}

export default async function DestinationsIndexPage({ params }: Props) {
  const { locale } = params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const tHd = await getTranslations({ locale, namespace: "HomeDestinations" });
  const siteName = tMeta("siteName");
  const slugs = getAllDestinationSlugs();
  const buckets = bucketDestinationSlugs(slugs);

  const otherSorted = [...buckets.other].sort((a, b) => {
    const pa = getLandingPageBySlug(a);
    const pb = getLandingPageBySlug(b);
    const la = pa ? getCopyForLocale(pa, locale).linkTitle : a;
    const lb = pb ? getCopyForLocale(pb, locale).linkTitle : b;
    return la.localeCompare(lb, locale === "ko" ? "ko" : locale === "ja" ? "ja" : "zh" === locale ? "zh" : "en");
  });

  return (
    <main className="mx-auto max-w-content px-4 py-12 pb-24 md:px-6 md:py-20 md:pb-20">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-metal-bronze-strong md:text-[13px]">
          {tHd("eyebrow")}
        </p>
        <h1 className="mt-3 font-sans text-2xl font-bold tracking-[-0.02em] text-tone-sky md:text-4xl">
          {tHd("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-white/70 md:text-base">
          {tHd("description")}
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href={`/${locale}/booking`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-gold px-8 text-sm font-semibold text-accent-foreground shadow-sm hover:brightness-110 md:text-[15px]"
          >
            {tHd("destinationsQuickBooking")}
          </Link>
        </div>
      </header>

      <div className="mt-10 space-y-12 md:mt-14 md:space-y-16">
        {HUB_CATEGORY_ORDER.map((cat) => {
          const catSlugs = buckets[cat];
          if (catSlugs.length === 0) return null;
          return (
            <section key={cat} aria-labelledby={`hub-cat-${cat}`}>
              <h2
                id={`hub-cat-${cat}`}
                className="font-sans text-lg font-semibold tracking-tight text-tone-sky md:text-xl"
              >
                {tHd(CATEGORY_LABEL_KEY[cat])}
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catSlugs
                  .filter((s) => getLandingPageBySlug(s))
                  .map((slug) => (
                    <DestinationCard key={slug} slug={slug} locale={locale} siteName={siteName} />
                  ))}
              </ul>
            </section>
          );
        })}

        {otherSorted.length > 0 ? (
          <section aria-labelledby="hub-cat-other">
            <h2
              id="hub-cat-other"
              className="font-sans text-lg font-semibold tracking-tight text-tone-sky md:text-xl"
            >
              {tHd("hubCategoryOther")}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherSorted
                .filter((s) => getLandingPageBySlug(s))
                .map((slug) => (
                  <DestinationCard key={slug} slug={slug} locale={locale} siteName={siteName} />
                ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
