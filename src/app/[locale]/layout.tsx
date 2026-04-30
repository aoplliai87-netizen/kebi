import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { Header } from "@/components/layout/Header";
import { QuickMenu } from "@/components/layout/QuickMenu";

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

  return (
    <NextIntlClientProvider messages={messages}>
      <LocalBusinessJsonLd locale={locale} />
      <div className="flex min-h-screen flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
      <QuickMenu />
    </NextIntlClientProvider>
  );
}
