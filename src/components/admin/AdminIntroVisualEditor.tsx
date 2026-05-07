"use client";

import { useMemo, useState } from "react";
import { BespokeIntroExperience } from "@/components/intro/BespokeIntroExperience";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";
import { INTRO_SERVICE_ALIGNS, INTRO_SERVICE_IMAGES } from "@/constants/introServices";
import type { AdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import { renderIntroBrandMarkup } from "@/lib/render-brand-markup";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";

type Props = {
  initial: SiteSettings;
  fallbackHints: AdminContentFallbacks;
};

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh"];

export function AdminIntroVisualEditor({ initial, fallbackHints }: Props) {
  const [locale, setLocale] = useState<LocaleKey>("ko");
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [panel, setPanel] = useState<"hero" | "core" | "services" | "contact" | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const intro = settings.subpages.intro;

  const services = useMemo(
    () =>
      ["s01", "s02", "s03", "s04"].map((_, i) => ({
        title: intro.services[i].title[locale] || fallbackHints.subpages.intro.services[i].title[locale],
        body: intro.services[i].body[locale] || fallbackHints.subpages.intro.services[i].body[locale],
        image: intro.services[i].image || INTRO_SERVICE_IMAGES[i] || INTRO_SERVICE_IMAGES[0],
        align: INTRO_SERVICE_ALIGNS[i] ?? "left",
      })),
    [intro, locale, fallbackHints],
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
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setPanel("hero")} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">히어로</button>
          <button type="button" onClick={() => setPanel("core")} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">핵심가치</button>
          <button type="button" onClick={() => setPanel("services")} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">서비스</button>
          <button type="button" onClick={() => setPanel("contact")} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">연락처</button>
          <button type="button" onClick={() => void save()} disabled={saving} className="rounded-md bg-brand-gold px-3 py-1 text-xs font-semibold text-black">{saving ? "저장 중" : "저장"}</button>
        </div>
      </div>
      {message ? <p className="text-xs text-tone-sky">{message}</p> : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-brand-gold/40 bg-black/70 px-2.5 py-1 text-[11px] text-brand-gold">ADMIN PREVIEW</div>
        <BespokeIntroExperience
          brandTitle={intro.brandTitle[locale] || fallbackHints.subpages.intro.brandTitle[locale]}
          sectionLabel={intro.sectionLabel[locale] || fallbackHints.subpages.intro.sectionLabel[locale]}
          headline={intro.headline[locale] || fallbackHints.subpages.intro.headline[locale]}
          description={renderIntroBrandMarkup(intro.description[locale] || fallbackHints.subpages.intro.description[locale])}
          coreValueEyebrow={intro.coreValueEyebrow[locale] || fallbackHints.subpages.intro.coreValueEyebrow[locale]}
          coreValueTitle={intro.coreValueTitle[locale] || fallbackHints.subpages.intro.coreValueTitle[locale]}
          coreValueBody={intro.coreValueBody[locale] || fallbackHints.subpages.intro.coreValueBody[locale]}
          contactEyebrow={intro.contactEyebrow[locale] || fallbackHints.subpages.intro.contactEyebrow[locale]}
          representativeName={intro.representativeName[locale] || fallbackHints.subpages.intro.representativeName[locale]}
          representativeLine={intro.representativeLine[locale] || fallbackHints.subpages.intro.representativeLine[locale]}
          phoneCaption={intro.phoneCaption[locale] || fallbackHints.subpages.intro.phoneCaption[locale]}
          phoneDisplay={settings.phoneDisplay}
          services={services}
        />
      </div>

      {panel === "hero" ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
          <input value={intro.brandTitle[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,brandTitle:{...s.subpages.intro.brandTitle,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.brandTitle[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <input value={intro.sectionLabel[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,sectionLabel:{...s.subpages.intro.sectionLabel,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.sectionLabel[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <input value={intro.headline[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,headline:{...s.subpages.intro.headline,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.headline[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <textarea rows={4} value={intro.description[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,description:{...s.subpages.intro.description,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.description[locale]} className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
        </div>
      ) : null}
      {panel === "core" ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
          <input value={intro.coreValueEyebrow[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,coreValueEyebrow:{...s.subpages.intro.coreValueEyebrow,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.coreValueEyebrow[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <input value={intro.coreValueTitle[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,coreValueTitle:{...s.subpages.intro.coreValueTitle,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.coreValueTitle[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <textarea rows={4} value={intro.coreValueBody[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,coreValueBody:{...s.subpages.intro.coreValueBody,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.coreValueBody[locale]} className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
        </div>
      ) : null}
      {panel === "services" ? (
        <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
          {services.map((_, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-white/10 bg-black/20 p-3">
              <input value={intro.services[i].title[locale]} onChange={(e)=>setSettings((s)=>{const n=[...s.subpages.intro.services]; n[i]={...n[i],title:{...n[i].title,[locale]:e.target.value}}; return {...s,subpages:{...s.subpages,intro:{...s.subpages.intro,services:n}}};})} placeholder={fallbackHints.subpages.intro.services[i].title[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
              <textarea rows={3} value={intro.services[i].body[locale]} onChange={(e)=>setSettings((s)=>{const n=[...s.subpages.intro.services]; n[i]={...n[i],body:{...n[i].body,[locale]:e.target.value}}; return {...s,subpages:{...s.subpages,intro:{...s.subpages.intro,services:n}}};})} placeholder={fallbackHints.subpages.intro.services[i].body[locale]} className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
              <AdminImageUploader
                section="intro"
                purpose={`service-${i + 1}`}
                label={`서비스 ${i + 1} 이미지`}
                value={intro.services[i].image}
                onChange={(next) =>
                  setSettings((s) => {
                    const n = [...s.subpages.intro.services];
                    n[i] = { ...n[i], image: next };
                    return { ...s, subpages: { ...s.subpages, intro: { ...s.subpages.intro, services: n } } };
                  })
                }
              />
            </div>
          ))}
        </div>
      ) : null}
      {panel === "contact" ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
          <input value={intro.contactEyebrow[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,contactEyebrow:{...s.subpages.intro.contactEyebrow,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.contactEyebrow[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <input value={intro.representativeName[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,representativeName:{...s.subpages.intro.representativeName,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.representativeName[locale]} className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm" />
          <textarea rows={3} value={intro.representativeLine[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,representativeLine:{...s.subpages.intro.representativeLine,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.representativeLine[locale]} className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
          <textarea rows={2} value={intro.phoneCaption[locale]} onChange={(e)=>setSettings((s)=>({...s,subpages:{...s.subpages,intro:{...s.subpages.intro,phoneCaption:{...s.subpages.intro.phoneCaption,[locale]:e.target.value}}}}))} placeholder={fallbackHints.subpages.intro.phoneCaption[locale]} className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm" />
        </div>
      ) : null}
    </section>
  );
}
