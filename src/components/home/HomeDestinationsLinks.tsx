import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getAllDestinationSlugs,
  getCopyForLocale,
  getLandingPageBySlug,
} from "../../../data/landing-pages";

type Props = {
  locale: string;
};

export async function HomeDestinationsLinks({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "HomeDestinations" });
  const slugs = getAllDestinationSlugs();

  return (
    <section
      className="mx-auto max-w-content px-4 py-16 md:px-6"
      aria-labelledby="home-destinations-title"
    >
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-metal-bronze-strong md:text-[13px]">
          {t("eyebrow")}
        </p>
        <h2
          id="home-destinations-title"
          className="mt-3 font-sans text-2xl font-bold tracking-[-0.02em] text-tone-sky md:text-3xl"
        >
          {t("title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
          {t("description")}
        </p>
      </div>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {slugs.map((slug) => {
          const page = getLandingPageBySlug(slug);
          if (!page) return null;
          const copy = getCopyForLocale(page, locale);
          return (
            <li key={slug}>
              <Link
                href={`/destinations/${slug}`}
                className="flex min-h-[3.25rem] items-center justify-center rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-center text-sm font-medium text-white/90 transition hover:border-brand-gold/35 hover:bg-white/[0.06] md:text-base"
              >
                {copy.linkTitle}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-center text-sm text-white/55">
        <Link href="/booking" className="text-brand-gold underline-offset-4 hover:underline">
          {t("toBooking")}
        </Link>
      </p>
    </section>
  );
}
