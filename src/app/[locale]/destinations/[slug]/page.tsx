import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DestinationLocalBusinessJsonLd } from "@/components/destinations/DestinationLocalBusinessJsonLd";
import { DestinationPageView } from "@/components/destinations/DestinationPageView";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { DestinationServiceJsonLd } from "@/components/seo/DestinationServiceJsonLd";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { routing } from "@/i18n/routing";
import { resolveDestinationLandingCopy } from "@/lib/destination-copy-resolve";
import { absoluteUrl, buildDestinationMetadata } from "@/lib/seo";
import { emptySeoPageSettings, parseKeywordsInput, pickLocaleText } from "@/lib/seo-settings";
import { getSiteSettings } from "@/lib/site-settings-store";
import {
  SITE_KAKAO_CHAT_URL,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site";
import {
  buildDestinationNavLinksForPage,
  getAllDestinationSlugs,
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
  const settings = await getSiteSettings();
  const copy = resolveDestinationLandingCopy(params.slug, params.locale, settings);
  if (!copy) {
    return {};
  }
  const t = await getTranslations({ locale: params.locale, namespace: "Metadata" });
  const localeKey = params.locale as "ko" | "en" | "ja" | "zh";
  const slugSeo = settings.seoDestinationBySlug[params.slug] ?? emptySeoPageSettings();
  const siteName = t("siteName");
  const fallbackTitle = `${copy.metaTitle} | ${siteName}`;
  const fallbackDescription = copy.metaDescription;
  const title = pickLocaleText(slugSeo.metaTitle, localeKey).trim() || fallbackTitle;
  const description = pickLocaleText(slugSeo.metaDescription, localeKey).trim() || fallbackDescription;

  return buildDestinationMetadata({
    locale: params.locale,
    slug: params.slug,
    title,
    description,
    keywords: copy.keywords,
    siteName,
    canonicalOverride: pickLocaleText(slugSeo.canonicalUrl, localeKey),
    ogTitleOverride: pickLocaleText(slugSeo.ogTitle, localeKey),
    ogDescriptionOverride: pickLocaleText(slugSeo.ogDescription, localeKey),
    ogImageOverride: slugSeo.ogImage,
    keywordsOverride: parseKeywordsInput(pickLocaleText(slugSeo.focusKeywords, localeKey)),
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
  const siteSettings = await getSiteSettings();
  const copy = resolveDestinationLandingCopy(slug, locale, siteSettings);
  if (!copy) {
    notFound();
  }
  const whatsappHref = siteSettings.contactLinks.whatsapp || SITE_WHATSAPP_URL;
  const kakaoHref = siteSettings.contactLinks.kakao || SITE_KAKAO_CHAT_URL;
  const phoneTel = siteSettings.phoneTel || SITE_PHONE_TEL;
  const canonical = absoluteUrl(`/${locale}/destinations/${slug}`);
  const homeUrl = absoluteUrl(`/${locale}`);
  const { relatedLinks, popularLinks, recommendedLinks, northGyeonggiLinks } =
    buildDestinationNavLinksForPage(landing, locale);
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
      <DestinationServiceJsonLd
        name={copy.h1}
        description={copy.localBusinessDescription}
        pageUrl={canonical}
        areaServedNames={copy.areaServedNames}
        providerName={siteName}
      />
      <DestinationPageView
        locale={locale}
        copy={copy}
        relatedLinks={relatedLinks}
        popularLinks={popularLinks}
        recommendedLinks={recommendedLinks}
        northGyeonggiLinks={northGyeonggiLinks}
        whatsappHref={whatsappHref}
        kakaoHref={kakaoHref}
        phoneTel={phoneTel}
        pricingSectionTitle={tDest("pricingSection")}
        faqSectionTitle={tDest("faqSection")}
        ctaSectionTitle={tDest("ctaSection")}
        relatedSectionTitle={tDest("relatedSection")}
        popularSectionTitle={tDest("popularSection")}
        recommendedSectionTitle={tDest("recommendedSection")}
        northGyeonggiSectionTitle={tDest("northGyeonggiSection")}
        operationalTipsSectionTitle={tDest("operationalTipsSection")}
        scenarioExamplesSectionTitle={tDest("scenarioExamplesSection")}
        poiSectionEyebrow={tDest("poiSectionEyebrow")}
        poiSectionTitle={tDest("poiSectionTitle")}
        poiTagsTitle={tDest("poiTagsTitle")}
        poiHotelsTitle={tDest("poiHotelsTitle")}
        poiLandmarksTitle={tDest("poiLandmarksTitle")}
        poiDropoffTitle={tDest("poiDropoffTitle")}
      />
    </>
  );
}
