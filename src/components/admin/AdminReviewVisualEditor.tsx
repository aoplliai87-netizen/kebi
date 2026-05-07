"use client";

import { useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { SubpageHero } from "@/components/layout/SubpageHero";
import { BespokeReviewExperience } from "@/components/review/BespokeReviewExperience";
import type { AdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import { pickLocalized } from "@/lib/home-sections";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";
import { pickSubpageLocalized } from "@/lib/subpages-content";

type Props = {
  initial: SiteSettings;
  fallbackHints: AdminContentFallbacks;
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>;
};

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh"];

export function AdminReviewVisualEditor({ initial, fallbackHints, messagesByLocale }: Props) {
  const [locale, setLocale] = useState<LocaleKey>("ko");
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [panel, setPanel] = useState<"hero" | "samples" | null>(null);

  const localeMessages = messagesByLocale[locale];
  const reviewCms = settings.subpages.review;
  const homeReviews = settings.home.reviews;
  const rows = [
    { content: pickLocalized(homeReviews.one.content, locale), author: pickLocalized(homeReviews.one.author, locale) },
    { content: pickLocalized(homeReviews.two.content, locale), author: pickLocalized(homeReviews.two.author, locale) },
    { content: pickLocalized(homeReviews.three.content, locale), author: pickLocalized(homeReviews.three.author, locale) },
  ];
  const showRows = rows.every((r) => r.content.trim() && r.author.trim());

  const hero = useMemo(
    () => ({
      eyebrow:
        pickSubpageLocalized(reviewCms.heroEyebrow, locale) || fallbackHints.subpages.review.heroEyebrow[locale],
      title:
        pickSubpageLocalized(reviewCms.heroTitle, locale) || fallbackHints.subpages.review.heroTitle[locale],
      desc:
        pickSubpageLocalized(reviewCms.heroDesc, locale) || fallbackHints.subpages.review.heroDesc[locale],
    }),
    [reviewCms, locale, fallbackHints],
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
            <button
              key={loc}
              type="button"
              onClick={() => setLocale(loc)}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                locale === loc ? "bg-brand-gold text-black" : "text-tone-strong"
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPanel("hero")} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">히어로 수정</button>
          <button type="button" onClick={() => setPanel("samples")} className="rounded-md border border-white/20 px-3 py-1 text-xs text-tone-strong">샘플 후기 수정</button>
          <button type="button" onClick={() => void save()} disabled={saving} className="rounded-md bg-brand-gold px-3 py-1 text-xs font-semibold text-black">{saving ? "저장 중" : "저장"}</button>
        </div>
      </div>
      {message ? <p className="text-xs text-tone-sky">{message}</p> : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-brand-gold/40 bg-black/70 px-2.5 py-1 text-[11px] text-brand-gold">
          ADMIN PREVIEW
        </div>
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <SubpageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.desc} />
          <BespokeReviewExperience sampleReviews={showRows ? rows : []} />
        </NextIntlClientProvider>
      </div>

      {panel === "hero" ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-tone-strong">리뷰 히어로 문구</p>
          <input
            value={settings.subpages.review.heroEyebrow[locale]}
            onChange={(e) => setSettings((s) => ({ ...s, subpages: { ...s.subpages, review: { ...s.subpages.review, heroEyebrow: { ...s.subpages.review.heroEyebrow, [locale]: e.target.value } } } }))}
            placeholder={fallbackHints.subpages.review.heroEyebrow[locale]}
            className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm"
          />
          <input
            value={settings.subpages.review.heroTitle[locale]}
            onChange={(e) => setSettings((s) => ({ ...s, subpages: { ...s.subpages, review: { ...s.subpages.review, heroTitle: { ...s.subpages.review.heroTitle, [locale]: e.target.value } } } }))}
            placeholder={fallbackHints.subpages.review.heroTitle[locale]}
            className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm"
          />
          <textarea
            rows={3}
            value={settings.subpages.review.heroDesc[locale]}
            onChange={(e) => setSettings((s) => ({ ...s, subpages: { ...s.subpages, review: { ...s.subpages.review, heroDesc: { ...s.subpages.review.heroDesc, [locale]: e.target.value } } } }))}
            placeholder={fallbackHints.subpages.review.heroDesc[locale]}
            className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
          />
        </div>
      ) : null}

      {panel === "samples" ? (
        <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-tone-strong">홈 샘플 후기 (3건 모두 입력 시에만 공개)</p>
          {(["one", "two", "three"] as const).map((slot, idx) => (
            <div key={slot} className="space-y-2 rounded-lg border border-white/10 bg-black/20 p-3">
              <p className="text-xs text-tone-soft">후기 {idx + 1}</p>
              <textarea
                rows={3}
                value={settings.home.reviews[slot].content[locale]}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    home: {
                      ...s.home,
                      reviews: {
                        ...s.home.reviews,
                        [slot]: {
                          ...s.home.reviews[slot],
                          content: { ...s.home.reviews[slot].content, [locale]: e.target.value },
                        },
                      },
                    },
                  }))
                }
                placeholder={fallbackHints.reviews[slot].content[locale]}
                className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
              />
              <input
                value={settings.home.reviews[slot].author[locale]}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    home: {
                      ...s.home,
                      reviews: {
                        ...s.home.reviews,
                        [slot]: {
                          ...s.home.reviews[slot],
                          author: { ...s.home.reviews[slot].author, [locale]: e.target.value },
                        },
                      },
                    },
                  }))
                }
                placeholder={fallbackHints.reviews[slot].author[locale]}
                className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm"
              />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
