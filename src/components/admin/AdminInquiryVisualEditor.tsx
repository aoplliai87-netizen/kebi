"use client";

import { useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { BespokeSupportExperience } from "@/components/support/BespokeSupportExperience";
import { SiteRuntimeProvider } from "@/components/providers/SiteRuntimeProvider";
import type { AdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";
import { SITE_PHONE_TEL } from "@/lib/site";

type Props = {
  initial: SiteSettings;
  fallbackHints: AdminContentFallbacks;
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>;
  mergedContact: { kakao: string; instagram: string; whatsapp: string; line: string; messenger: string };
};

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh"];

export function AdminInquiryVisualEditor({ initial, fallbackHints, messagesByLocale, mergedContact }: Props) {
  const [locale, setLocale] = useState<LocaleKey>("ko");
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [panel, setPanel] = useState<"hero" | "faq" | "form" | "contact" | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const q = settings.subpages.inquiry;
  const localeMessages = messagesByLocale[locale];

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

  const overrides = {
    heroEyebrow: q.heroEyebrow[locale],
    heroTitle: q.heroTitle[locale],
    heroDesc: q.heroDesc[locale],
    faqTitle: q.faqTitle[locale],
    faqQ1: q.faqItems[0].q[locale],
    faqA1: q.faqItems[0].a[locale],
    faqQ2: q.faqItems[1].q[locale],
    faqA2: q.faqItems[1].a[locale],
    faqQ3: q.faqItems[2].q[locale],
    faqA3: q.faqItems[2].a[locale],
    faqQ4: q.faqItems[3].q[locale],
    faqA4: q.faqItems[3].a[locale],
    faqQ5: q.faqItems[4].q[locale],
    faqA5: q.faqItems[4].a[locale],
    formTitle: q.formTitle[locale],
    formDesc: q.formDesc[locale],
    contactSectionTitle: q.contactSectionTitle[locale],
    contactSectionDesc: q.contactSectionDesc[locale],
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="inline-flex gap-1 rounded-lg border border-white/15 bg-black/20 p-1">
          {LOCALES.map((loc) => (
            <button key={loc} type="button" onClick={() => setLocale(loc)} className={`rounded-md px-3 py-1 text-xs font-semibold ${locale === loc ? "bg-brand-gold text-black" : "text-tone-strong"}`}>{loc.toUpperCase()}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setPanel("hero")} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">히어로</button>
          <button type="button" onClick={() => setPanel("faq")} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">FAQ</button>
          <button type="button" onClick={() => setPanel("form")} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">폼</button>
          <button type="button" onClick={() => setPanel("contact")} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">문의채널</button>
          <button type="button" onClick={() => void save()} disabled={saving} className="rounded-md bg-brand-gold px-3 py-1 text-xs font-semibold text-black">{saving ? "저장 중" : "저장"}</button>
        </div>
      </div>
      {message ? <p className="text-xs text-tone-sky">{message}</p> : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-brand-gold/40 bg-black/70 px-2.5 py-1 text-[11px] text-brand-gold">ADMIN PREVIEW</div>
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <SiteRuntimeProvider value={runtimeConfig}>
            <BespokeSupportExperience contentOverrides={overrides} />
          </SiteRuntimeProvider>
        </NextIntlClientProvider>
      </div>

      {panel === "hero" ? (
        <div className="grid gap-2 rounded-xl border border-white/10 bg-black/20 p-4">
          <input value={q.heroEyebrow[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,inquiry:{...s.subpages.inquiry,heroEyebrow:{...s.subpages.inquiry.heroEyebrow,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.inquiry.heroEyebrow[locale]} className="h-10 rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <input value={q.heroTitle[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,inquiry:{...s.subpages.inquiry,heroTitle:{...s.subpages.inquiry.heroTitle,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.inquiry.heroTitle[locale]} className="h-10 rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <textarea rows={3} value={q.heroDesc[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,inquiry:{...s.subpages.inquiry,heroDesc:{...s.subpages.inquiry.heroDesc,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.inquiry.heroDesc[locale]} className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
        </div>
      ) : null}
      {panel === "faq" ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
          <input value={q.faqTitle[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,inquiry:{...s.subpages.inquiry,faqTitle:{...s.subpages.inquiry.faqTitle,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.inquiry.faqTitle[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          {[0,1,2,3,4].map((i)=>(
            <div key={i} className="rounded-lg border border-white/10 bg-black/20 p-3">
              <textarea rows={2} value={q.faqItems[i].q[locale]} onChange={(e)=>setSettings((s)=>{const n=[...s.subpages.inquiry.faqItems]; n[i]={...n[i],q:{...n[i].q,[locale]:e.target.value}}; return {...s,subpages:{...s.subpages,inquiry:{...s.subpages.inquiry,faqItems:n}}};})} placeholder={fallbackHints.subpages.inquiry.faqItems[i].q[locale]} className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
              <textarea rows={3} value={q.faqItems[i].a[locale]} onChange={(e)=>setSettings((s)=>{const n=[...s.subpages.inquiry.faqItems]; n[i]={...n[i],a:{...n[i].a,[locale]:e.target.value}}; return {...s,subpages:{...s.subpages,inquiry:{...s.subpages.inquiry,faqItems:n}}};})} placeholder={fallbackHints.subpages.inquiry.faqItems[i].a[locale]} className="mt-2 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
            </div>
          ))}
        </div>
      ) : null}
      {panel === "form" ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
          <input value={q.formTitle[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,inquiry:{...s.subpages.inquiry,formTitle:{...s.subpages.inquiry.formTitle,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.inquiry.formTitle[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <textarea rows={3} value={q.formDesc[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,inquiry:{...s.subpages.inquiry,formDesc:{...s.subpages.inquiry.formDesc,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.inquiry.formDesc[locale]} className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
        </div>
      ) : null}
      {panel === "contact" ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
          <input value={q.contactSectionTitle[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,inquiry:{...s.subpages.inquiry,contactSectionTitle:{...s.subpages.inquiry.contactSectionTitle,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.inquiry.contactSectionTitle[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <textarea rows={3} value={q.contactSectionDesc[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,inquiry:{...s.subpages.inquiry,contactSectionDesc:{...s.subpages.inquiry.contactSectionDesc,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.inquiry.contactSectionDesc[locale]} className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
        </div>
      ) : null}
    </section>
  );
}
