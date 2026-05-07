import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { buildPageMetadata, type SeoPageKey } from "@/lib/seo";
import { parseKeywordsInput, pickLocaleText } from "@/lib/seo-settings";
import { getSiteSettings } from "@/lib/site-settings-store";

export async function getLocalizedPageMetadata(
  locale: string,
  page: SeoPageKey,
): Promise<Metadata> {
  const localeKey = (locale === "en" || locale === "ja" || locale === "zh" ? locale : "ko") as
    | "ko"
    | "en"
    | "ja"
    | "zh";
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const settings = await getSiteSettings();
  const seoPageKey = page === "support" ? "inquiry" : page;
  const managed = settings.seo[seoPageKey];
  const fallbackTitle = t(`pages.${page}.title`);
  const fallbackDescription = t(`pages.${page}.description`);
  const legacyHomeTitle =
    page === "home" ? settings.seoHomeTitleByLocale[localeKey].trim() || settings.seoHomeTitle.trim() : "";
  const legacyHomeDescription =
    page === "home"
      ? settings.seoHomeDescriptionByLocale[localeKey].trim() || settings.seoHomeDescription.trim()
      : "";
  const title = pickLocaleText(managed.metaTitle, localeKey) || legacyHomeTitle || fallbackTitle;
  const description =
    pickLocaleText(managed.metaDescription, localeKey) || legacyHomeDescription || fallbackDescription;

  return buildPageMetadata({
    locale,
    page,
    title,
    description,
    siteName: t("siteName"),
    canonicalOverride: pickLocaleText(managed.canonicalUrl, localeKey),
    ogTitleOverride: pickLocaleText(managed.ogTitle, localeKey) || legacyHomeTitle,
    ogDescriptionOverride: pickLocaleText(managed.ogDescription, localeKey) || legacyHomeDescription,
    ogImageOverride: managed.ogImage,
    keywordsOverride: parseKeywordsInput(pickLocaleText(managed.focusKeywords, localeKey)),
  });
}
