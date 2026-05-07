"use client";

import { useMemo, useState } from "react";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";
import { SEO_PAGE_KEYS, type ManagedSeoPageKey, type SeoPagesSettings } from "@/lib/seo-settings";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";

type Props = {
  initial: SiteSettings;
  fallback: SeoPagesSettings;
};

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh"];
const PAGE_LABEL: Record<ManagedSeoPageKey, string> = {
  home: "홈",
  intro: "소개",
  vehicle: "차량안내",
  pricing: "요금안내",
  booking: "온라인예약",
  review: "리뷰",
  inquiry: "문의/FAQ",
  destinations: "목적지 랜딩페이지",
};

export function AdminSeoSettingsForm({ initial, fallback }: Props) {
  const bootstrapped = useMemo<SiteSettings>(() => {
    const locales: LocaleKey[] = ["ko", "en", "ja", "zh"];
    const nextSeo = { ...initial.seo };
    for (const key of SEO_PAGE_KEYS) {
      const page = { ...nextSeo[key] };
      page.metaTitle = { ...page.metaTitle };
      page.metaDescription = { ...page.metaDescription };
      page.ogTitle = { ...page.ogTitle };
      page.ogDescription = { ...page.ogDescription };
      page.canonicalUrl = { ...page.canonicalUrl };
      page.focusKeywords = { ...page.focusKeywords };
      page.searchAssistNotes = { ...page.searchAssistNotes };
      for (const loc of locales) {
        const legacyHomeTitle =
          key === "home"
            ? initial.seoHomeTitleByLocale[loc].trim() || (loc === "ko" ? initial.seoHomeTitle.trim() : "")
            : "";
        const legacyHomeDescription =
          key === "home"
            ? initial.seoHomeDescriptionByLocale[loc].trim() ||
              (loc === "ko" ? initial.seoHomeDescription.trim() : "")
            : "";
        page.metaTitle[loc] = page.metaTitle[loc].trim() || legacyHomeTitle || fallback[key].metaTitle[loc];
        page.metaDescription[loc] =
          page.metaDescription[loc].trim() ||
          legacyHomeDescription ||
          fallback[key].metaDescription[loc];
        page.ogTitle[loc] = page.ogTitle[loc].trim() || page.metaTitle[loc];
        page.ogDescription[loc] = page.ogDescription[loc].trim() || page.metaDescription[loc];
        page.canonicalUrl[loc] = page.canonicalUrl[loc].trim() || fallback[key].canonicalUrl[loc];
      }
      nextSeo[key] = page;
    }
    return { ...initial, seo: nextSeo };
  }, [initial, fallback]);

  const [settings, setSettings] = useState<SiteSettings>(bootstrapped);
  const [locale, setLocale] = useState<LocaleKey>("ko");
  const [page, setPage] = useState<ManagedSeoPageKey>("home");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const current = settings.seo[page];
  const fb = fallback[page];
  const showHint = (value: string, next: string) => (!value.trim() && next.trim() ? next : "");

  const keywordCount = useMemo(
    () => current.focusKeywords[locale].split(/\r?\n|,/g).map((v) => v.trim()).filter(Boolean).length,
    [current.focusKeywords, locale],
  );

  const patchLocalized = (
    field:
      | "metaTitle"
      | "metaDescription"
      | "ogTitle"
      | "ogDescription"
      | "canonicalUrl"
      | "focusKeywords"
      | "searchAssistNotes",
    value: string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [page]: {
          ...prev.seo[page],
          [field]: { ...prev.seo[page][field], [locale]: value },
        },
      },
    }));
  };

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
      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="mb-2 text-xs text-tone-soft">언어</div>
        <div className="inline-flex gap-1 rounded-lg border border-white/15 bg-black/20 p-1">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocale(loc)}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${locale === loc ? "bg-brand-gold text-black" : "text-tone-strong"}`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="mb-2 text-xs text-tone-soft">페이지</div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {SEO_PAGE_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPage(key)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                page === key
                  ? "border-brand-gold/60 bg-brand-gold/15 text-brand-gold"
                  : "border-white/20 bg-black/20 text-tone-strong"
              }`}
            >
              {PAGE_LABEL[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
        <p className="text-sm font-semibold text-tone-strong">{PAGE_LABEL[page]} SEO ({locale.toUpperCase()})</p>

        <input
          value={current.metaTitle[locale]}
          onChange={(e) => patchLocalized("metaTitle", e.target.value)}
          placeholder={fb.metaTitle[locale]}
          className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm"
        />
        {showHint(current.metaTitle[locale], fb.metaTitle[locale]) ? <p className="text-xs text-tone-soft">기본값: {fb.metaTitle[locale]}</p> : null}

        <textarea
          rows={3}
          value={current.metaDescription[locale]}
          onChange={(e) => patchLocalized("metaDescription", e.target.value)}
          placeholder={fb.metaDescription[locale]}
          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
        />
        {showHint(current.metaDescription[locale], fb.metaDescription[locale]) ? <p className="text-xs text-tone-soft">현재 기본값: {fb.metaDescription[locale]}</p> : null}

        <input
          value={current.ogTitle[locale]}
          onChange={(e) => patchLocalized("ogTitle", e.target.value)}
          placeholder={fb.ogTitle[locale]}
          className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm"
        />
        {showHint(current.ogTitle[locale], fb.ogTitle[locale]) ? <p className="text-xs text-tone-soft">현재 기본값: {fb.ogTitle[locale]}</p> : null}

        <textarea
          rows={3}
          value={current.ogDescription[locale]}
          onChange={(e) => patchLocalized("ogDescription", e.target.value)}
          placeholder={fb.ogDescription[locale]}
          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
        />
        {showHint(current.ogDescription[locale], fb.ogDescription[locale]) ? <p className="text-xs text-tone-soft">현재 기본값: {fb.ogDescription[locale]}</p> : null}

        <AdminImageUploader
          section="seo"
          purpose={page}
          label="OG 이미지"
          value={current.ogImage}
          onChange={(next) =>
            setSettings((prev) => ({
              ...prev,
              seo: { ...prev.seo, [page]: { ...prev.seo[page], ogImage: next } },
            }))
          }
        />

        <input
          value={current.canonicalUrl[locale]}
          onChange={(e) => patchLocalized("canonicalUrl", e.target.value)}
          placeholder={fb.canonicalUrl[locale]}
          className="h-10 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm"
        />
        {showHint(current.canonicalUrl[locale], fb.canonicalUrl[locale]) ? <p className="text-xs text-tone-soft">현재 기본값: {fb.canonicalUrl[locale]}</p> : null}

        <textarea
          rows={3}
          value={current.focusKeywords[locale]}
          onChange={(e) => patchLocalized("focusKeywords", e.target.value)}
          placeholder="쉼표 또는 줄바꿈으로 키워드 입력"
          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
        />
        <p className="text-xs text-tone-soft">포커스 키워드 {keywordCount}개</p>

        <textarea
          rows={3}
          value={current.searchAssistNotes[locale]}
          onChange={(e) => patchLocalized("searchAssistNotes", e.target.value)}
          placeholder="네이버/일본 검색용 보조 키워드 메모"
          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-metal-bronze/30 bg-[#0a1522] px-4 py-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-brand-gold to-[#b8892a] px-5 text-sm font-bold text-black disabled:opacity-50"
        >
          {saving ? "저장 중…" : "SEO 저장"}
        </button>
        <p className="text-xs text-tone-soft">{message || "저장값이 있으면 generateMetadata에서 우선 사용됩니다."}</p>
      </div>
    </section>
  );
}
