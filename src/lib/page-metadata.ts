import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { buildPageMetadata, type SeoPageKey } from "@/lib/seo";

export async function getLocalizedPageMetadata(
  locale: string,
  page: SeoPageKey,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildPageMetadata({
    locale,
    page,
    title: t(`pages.${page}.title`),
    description: t(`pages.${page}.description`),
    siteName: t("siteName"),
  });
}
