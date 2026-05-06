import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { WebsiteJsonLd } from "@/components/seo/WebsiteJsonLd";
import { Header } from "@/components/layout/Header";
import { QuickMenu } from "@/components/layout/QuickMenu";
import { getSiteSettings } from "@/lib/site-settings-store";
import {
  SITE_FACEBOOK_MESSENGER_URL,
  SITE_INSTAGRAM_DM_URL,
  SITE_KAKAO_CHAT_URL,
  SITE_LINE_URL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site";
import { SiteRuntimeProvider } from "@/components/providers/SiteRuntimeProvider";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const siteSettings = await getSiteSettings();
  const runtimeConfig = {
    phoneDisplay: siteSettings.phoneDisplay || SITE_PHONE_DISPLAY,
    phoneTel: siteSettings.phoneTel || SITE_PHONE_TEL,
    links: {
      kakao: siteSettings.contactLinks.kakao || SITE_KAKAO_CHAT_URL,
      instagram: siteSettings.contactLinks.instagram || SITE_INSTAGRAM_DM_URL,
      whatsapp: siteSettings.contactLinks.whatsapp || SITE_WHATSAPP_URL,
      line: siteSettings.contactLinks.line || SITE_LINE_URL,
      messenger: siteSettings.contactLinks.messenger || SITE_FACEBOOK_MESSENGER_URL,
    },
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <LocalBusinessJsonLd locale={locale} />
      <WebsiteJsonLd locale={locale} />
      <SiteRuntimeProvider value={runtimeConfig}>
        <div className="flex min-h-screen flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
          <Header phoneDisplay={runtimeConfig.phoneDisplay} phoneTel={runtimeConfig.phoneTel} />
          <main className="flex-1">{children}</main>
        </div>
        <QuickMenu />
      </SiteRuntimeProvider>
    </NextIntlClientProvider>
  );
}
