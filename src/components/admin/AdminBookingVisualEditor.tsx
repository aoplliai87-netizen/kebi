"use client";

import { useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { BespokeBookingExperience } from "@/components/booking/BespokeBookingExperience";
import { SiteRuntimeProvider } from "@/components/providers/SiteRuntimeProvider";
import type { AdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";
import { SITE_PHONE_TEL } from "@/lib/site";
import { pickSubpageLocalized } from "@/lib/subpages-content";

type Props = {
  initial: SiteSettings;
  fallbackHints: AdminContentFallbacks;
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>;
  mergedContact: { kakao: string; instagram: string; whatsapp: string; line: string; messenger: string };
};

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh"];

export function AdminBookingVisualEditor({ initial, fallbackHints, messagesByLocale, mergedContact }: Props) {
  const [locale, setLocale] = useState<LocaleKey>("ko");
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const localeMessages = messagesByLocale[locale];
  const booking = settings.subpages.booking;
  const title = pickSubpageLocalized(booking.title, locale) || fallbackHints.subpages.booking.title[locale];
  const description =
    pickSubpageLocalized(booking.description, locale) || fallbackHints.subpages.booking.description[locale];

  const runtimeConfig = useMemo(
    () => ({
      phoneDisplay: settings.phoneDisplay,
      phoneTel: settings.phoneTel || SITE_PHONE_TEL,
      links: mergedContact,
    }),
    [settings.phoneDisplay, settings.phoneTel, mergedContact],
  );

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = (await res.json()) as { ok?: boolean; message?: string };
      setMessage(result.ok ? "저장 완료" : result.message ?? "저장 실패");
    } catch {
      setMessage("저장 실패");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="inline-flex gap-1 rounded-lg border border-white/15 bg-black/20 p-1">
          {LOCALES.map((loc) => (
            <button key={loc} type="button" onClick={() => setLocale(loc)} className={`rounded-md px-3 py-1 text-xs font-semibold ${locale === loc ? "bg-brand-gold text-black" : "text-tone-strong"}`}>{loc.toUpperCase()}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">본문 수정</button>
          <button type="button" onClick={() => void save()} disabled={saving} className="rounded-md bg-brand-gold px-3 py-1 text-xs font-semibold text-black">{saving ? "저장 중" : "저장"}</button>
        </div>
      </div>
      {message ? <p className="text-xs text-tone-sky">{message}</p> : null}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-brand-gold/40 bg-black/70 px-2.5 py-1 text-[11px] text-brand-gold">ADMIN PREVIEW</div>
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <SiteRuntimeProvider value={runtimeConfig}>
            <BespokeBookingExperience locale={locale} title={title} description={description} />
          </SiteRuntimeProvider>
        </NextIntlClientProvider>
      </div>
      {open ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
          <input
            value={settings.subpages.booking.title[locale]}
            onChange={(e) => setSettings((s) => ({ ...s, subpages: { ...s.subpages, booking: { ...s.subpages.booking, title: { ...s.subpages.booking.title, [locale]: e.target.value } } } }))}
            placeholder={fallbackHints.subpages.booking.title[locale]}
            className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm"
          />
          <textarea
            rows={4}
            value={settings.subpages.booking.description[locale]}
            onChange={(e) => setSettings((s) => ({ ...s, subpages: { ...s.subpages, booking: { ...s.subpages.booking, description: { ...s.subpages.booking.description, [locale]: e.target.value } } } }))}
            placeholder={fallbackHints.subpages.booking.description[locale]}
            className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
          />
        </div>
      ) : null}
    </section>
  );
}
