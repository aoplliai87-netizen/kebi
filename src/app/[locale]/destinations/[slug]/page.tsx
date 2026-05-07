import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DestinationLocalBusinessJsonLd } from "@/components/destinations/DestinationLocalBusinessJsonLd";
import { DestinationPageView } from "@/components/destinations/DestinationPageView";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { routing } from "@/i18n/routing";
import { absoluteUrl, buildDestinationMetadata } from "@/lib/seo";
import { parseKeywordsInput, pickLocaleText } from "@/lib/seo-settings";
import { getSiteSettings } from "@/lib/site-settings-store";
import {
  SITE_KAKAO_CHAT_URL,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site";
import {
  LANDING_PAGES,
  getAllDestinationSlugs,
  getCopyForLocale,
  getLandingPageBySlug,
} from "../../../../../data/landing-pages";

type Props = {
  params: { locale: string; slug: string };
};

export function generateStaticParams() {
  return getAllDestinationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const landing = getLandingPageBySlug(params.slug);
  if (!landing) {
    return {};
  }
  const copy = getCopyForLocale(landing, params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "Metadata" });
  const settings = await getSiteSettings();
  const localeKey = params.locale as "ko" | "en" | "ja" | "zh";
  const destinationSeo = settings.seo.destinations;
  const siteName = t("siteName");
  const fallbackTitle = `${copy.metaTitle} | ${siteName}`;
  const fallbackDescription = copy.metaDescription;
  const title = pickLocaleText(destinationSeo.metaTitle, localeKey) || fallbackTitle;
  const description = pickLocaleText(destinationSeo.metaDescription, localeKey) || fallbackDescription;

  return buildDestinationMetadata({
    locale: params.locale,
    slug: params.slug,
    title,
    description,
    keywords: copy.keywords,
    siteName,
    canonicalOverride: pickLocaleText(destinationSeo.canonicalUrl, localeKey),
    ogTitleOverride: pickLocaleText(destinationSeo.ogTitle, localeKey),
    ogDescriptionOverride: pickLocaleText(destinationSeo.ogDescription, localeKey),
    ogImageOverride: destinationSeo.ogImage,
    keywordsOverride: parseKeywordsInput(pickLocaleText(destinationSeo.focusKeywords, localeKey)),
  });
}

export default async function DestinationLandingPage({ params }: Props) {
  const { locale, slug } = params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const landing = getLandingPageBySlug(slug);
  if (!landing) {
    notFound();
  }

  setRequestLocale(locale);
  const copy = getCopyForLocale(landing, locale);
  const siteSettings = await getSiteSettings();
  const whatsappHref = siteSettings.contactLinks.whatsapp || SITE_WHATSAPP_URL;
  const kakaoHref = siteSettings.contactLinks.kakao || SITE_KAKAO_CHAT_URL;
  const phoneTel = siteSettings.phoneTel || SITE_PHONE_TEL;
  const canonical = absoluteUrl(`/${locale}/destinations/${slug}`);
  const homeUrl = absoluteUrl(`/${locale}`);
  const relatedLinks = LANDING_PAGES.filter((entry) => entry.slug !== slug)
    .slice(0, 2)
    .map((entry) => {
      const relatedCopy = getCopyForLocale(entry, locale);
      return {
        href: `/destinations/${entry.slug}`,
        label: relatedCopy.linkTitle,
      };
    });
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const tDest = await getTranslations({ locale, namespace: "HomeDestinations" });
  const siteName = tMeta("siteName");
  const lbName = `${siteName} — ${copy.h1}`;

  return (
    <>
      <DestinationLocalBusinessJsonLd
        name={lbName}
        description={copy.localBusinessDescription}
        pageUrl={canonical}
        areaServedNames={copy.areaServedNames}
      />
      <BreadcrumbJsonLd
        items={[
          { name: copy.homeLinkLabel, item: homeUrl },
          { name: copy.h1, item: canonical },
        ]}
      />
      <FaqJsonLd items={copy.faq} />
      <DestinationPageView
        locale={locale}
        copy={copy}
        relatedLinks={relatedLinks}
        whatsappHref={whatsappHref}
        kakaoHref={kakaoHref}
        phoneTel={phoneTel}
        pricingSectionTitle={tDest("pricingSection")}
        faqSectionTitle={tDest("faqSection")}
        ctaSectionTitle={tDest("ctaSection")}
        relatedSectionTitle={tDest("relatedSection")}
      />
    </>
  );
}
