"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";
import type { AdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import type { HomeSections } from "@/lib/home-sections";
import type { SubpagesContent } from "@/lib/subpages-content";
import type {
  LocaleKey,
  LocalizedPricingTiers,
  LocalizedText,
  ManagedPricingTier,
  SiteSettings,
} from "@/lib/site-settings-store";

type Props = {
  initial: SiteSettings;
  fallbackHints: AdminContentFallbacks;
  initialTab?: TabId;
  allowedTabs?: TabId[];
};

// ── helpers ────────────────────────────────────────────────
function pickLegacyText(by: LocalizedText, fallback: string): string {
  return by.ko.trim() || by.en.trim() || by.ja.trim() || by.zh.trim() || fallback.trim();
}
function tiersLegacyFromKo(rows: ManagedPricingTier[] | undefined): ManagedPricingTier[] {
  if (!rows?.length) return [];
  return rows
    .map((r) => ({ label: r.label.trim(), price: r.price.trim(), note: r.note.trim() }))
    .filter((r) => r.label && r.price && r.note);
}

// ── tab ids ────────────────────────────────────────────────
type TabId =
  | "home"
  | "intro"
  | "vehicle"
  | "pricing"
  | "gallery"
  | "contact"
  | "booking"
  | "reviews"
  | "faq"
  | "subpages";
const TABS: { id: TabId; label: string; icon: string; desc: string }[] = [
  { id: "home", label: "🏠 홈 문구", icon: "🏠", desc: "히어로 타이틀·서브타이틀·About Me 문구" },
  { id: "intro", label: "📜 인트로", icon: "📜", desc: "홈 소개 대형 섹션 (IntroPage.hero)" },
  { id: "vehicle", label: "🚐 차량", icon: "🚐", desc: "차량 섹션 제목·설명" },
  { id: "pricing", label: "💰 홈 요금 카드", icon: "💰", desc: "홈 메인 요금 카드 3개의 제목·금액·안내 문구" },
  { id: "gallery", label: "🖼 갤러리", icon: "🖼", desc: "홈 하단 갤러리 이미지" },
  { id: "contact", label: "📞 연락처", icon: "📞", desc: "전화번호·카카오·WhatsApp 등 링크" },
  { id: "booking", label: "📅 예약 CTA", icon: "📅", desc: "온라인 예약 섹션 문구·버튼" },
  { id: "reviews", label: "⭐ 후기", icon: "⭐", desc: "홈 고객 후기 3건" },
  { id: "faq", label: "❓ FAQ", icon: "❓", desc: "홈 하단 FAQ 5개" },
  { id: "subpages", label: "📄 서브페이지", icon: "📄", desc: "/booking /inquiry /intro /review 본문 CMS" },
];

const LOCALE_LABELS: Record<LocaleKey, string> = { ko: "🇰🇷 한국어", en: "🇺🇸 English", ja: "🇯🇵 日本語", zh: "🇨🇳 中文" };
const LOCALE_OPTIONS: LocaleKey[] = ["ko", "en", "ja", "zh"];

// ── sub-components ─────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-semibold text-tone-strong">{label}</p>
      {hint ? <p className="text-xs leading-relaxed text-tone-soft">{hint}</p> : null}
      {children}
    </div>
  );
}
function Input({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm text-tone-strong placeholder:text-tone-soft/50 focus:border-brand-gold/60 focus:outline-none ${className}`}
    />
  );
}
function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-tone-strong placeholder:text-tone-soft/50 focus:border-brand-gold/60 focus:outline-none"
    />
  );
}
function LocaleTabs({ selected, onSelect }: { selected: LocaleKey; onSelect: (l: LocaleKey) => void }) {
  return (
    <div className="inline-flex gap-1 rounded-xl border border-white/15 bg-black/25 p-1">
      {LOCALE_OPTIONS.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => onSelect(loc)}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
            selected === loc ? "bg-brand-gold text-black shadow" : "text-tone-strong hover:text-brand-gold"
          }`}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
function SectionNote({ where, color = "sky" }: { where: string; color?: "sky" | "gold" }) {
  const cls = color === "gold"
    ? "border-brand-gold/30 bg-brand-gold/10 text-brand-gold"
    : "border-tone-sky/25 bg-tone-sky/8 text-tone-sky";
  return (
    <div className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-relaxed ${cls}`}>
      <span className="mt-px shrink-0">📍</span>
      <span>{where}</span>
    </div>
  );
}
function SaveBar({ saving, message }: { saving: boolean; message: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-metal-bronze/30 bg-[#0a1522] px-4 py-3">
      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-brand-gold to-[#b8892a] px-5 text-sm font-bold text-black shadow hover:brightness-110 disabled:opacity-50"
      >
        {saving ? "저장 중…" : "💾 저장하기"}
      </button>
      {message ? (
        <p className="text-sm text-tone-sky">{message}</p>
      ) : (
        <p className="text-xs text-tone-soft">변경 후 반드시 저장하세요.</p>
      )}
    </div>
  );
}

// ── main form ──────────────────────────────────────────────
export function AdminSiteSettingsForm({
  initial,
  fallbackHints,
  initialTab = "home",
  allowedTabs,
}: Props) {
  const allowedTabsKey = allowedTabs == null ? "__all__" : [...allowedTabs].sort().join(",");
  const visibleTabs = useMemo(() => {
    if (allowedTabsKey === "__all__") return TABS;
    const allowed = new Set(allowedTabsKey.split(","));
    return TABS.filter((tab) => allowed.has(tab.id));
  }, [allowedTabsKey]);
  const defaultTab = visibleTabs[0]?.id ?? "home";
  const [activeTab, setActiveTab] = useState<TabId>(
    visibleTabs.some((tab) => tab.id === initialTab) ? initialTab : defaultTab,
  );
  const [locale, setLocale] = useState<LocaleKey>("ko");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [changeLogs, setChangeLogs] = useState<Array<{ id: string; createdAt: string; summary: string }>>([]);

  // ── state ──
  const [heroTitleByLocale, setHeroTitleByLocale] = useState<LocalizedText>(initial.heroTitleByLocale);
  const [heroSubtitleByLocale, setHeroSubtitleByLocale] = useState<LocalizedText>(initial.heroSubtitleByLocale);
  const [aboutMeTitleByLocale, setAboutMeTitleByLocale] = useState<LocalizedText>(initial.aboutMeTitleByLocale);
  const [aboutMeDescriptionByLocale, setAboutMeDescriptionByLocale] = useState<LocalizedText>(initial.aboutMeDescriptionByLocale);
  const [vehicleSectionTitleByLocale, setVehicleSectionTitleByLocale] = useState<LocalizedText>(initial.vehicleSectionTitleByLocale);
  const [vehicleSectionDescriptionByLocale, setVehicleSectionDescriptionByLocale] = useState<LocalizedText>(initial.vehicleSectionDescriptionByLocale);
  const [pricingTiersByLocale, setPricingTiersByLocale] = useState<LocalizedPricingTiers>(initial.pricingTiersByLocale);
  const [galleryText, setGalleryText] = useState(initial.galleryImageUrls.join("\n"));
  const [phoneDisplay, setPhoneDisplay] = useState(initial.phoneDisplay);
  const [kakaoUrl, setKakaoUrl] = useState(initial.contactLinks.kakao);
  const [instagramUrl, setInstagramUrl] = useState(initial.contactLinks.instagram);
  const [whatsappUrl, setWhatsappUrl] = useState(initial.contactLinks.whatsapp);
  const [lineUrl, setLineUrl] = useState(initial.contactLinks.line);
  const [messengerUrl, setMessengerUrl] = useState(initial.contactLinks.messenger);
  const seoHomeTitleByLocale = initial.seoHomeTitleByLocale;
  const seoHomeDescriptionByLocale = initial.seoHomeDescriptionByLocale;
  const [home, setHome] = useState<HomeSections>(initial.home);
  const [subpages, setSubpages] = useState<SubpagesContent>(initial.subpages);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newHeroSlideUrl, setNewHeroSlideUrl] = useState("");
  const hint = (value: string, fallback: string) =>
    !value.trim() && fallback.trim() ? fallback : "";

  const appendGalleryUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setGalleryText((prev) => {
      const lines = prev.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.includes(trimmed)) return prev;
      return lines.length > 0 ? `${lines.join("\n")}\n${trimmed}` : trimmed;
    });
  };

  const appendHeroSlideUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setHome((prev) => {
      const next = [...(prev.heroVisuals ?? [])].map((v) => v.trim()).filter(Boolean);
      if (next.includes(trimmed)) return prev;
      next.push(trimmed);
      return { ...prev, heroVisuals: next };
    });
  };

  const galleryPreview = useMemo(
    () => galleryText.split("\n").map((l) => l.trim()).filter(Boolean),
    [galleryText],
  );

  useEffect(() => {
    const t = toast ? window.setTimeout(() => setToast(null), 2800) : null;
    return () => { if (t) window.clearTimeout(t); };
  }, [toast]);

  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(defaultTab);
    }
  }, [activeTab, defaultTab, visibleTabs]);

  /** 상단 카드·주소창 `?tab=` 이동 시 클라이언트 탭 상태 동기화 (초기 마운트만이 아님) */
  useEffect(() => {
    if (visibleTabs.some((tab) => tab.id === initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab, visibleTabs]);

  useEffect(() => {
    void fetch("/api/admin/change-logs?limit=15", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { ok?: boolean; logs?: Array<{ id: string; createdAt: string; summary: string }> }) => {
        if (d.ok && Array.isArray(d.logs)) setChangeLogs(d.logs);
      });
  }, []);

  // ── helpers ──
  const setLocalized = (setter: (v: (p: LocalizedText) => LocalizedText) => void) => (val: string) =>
    setter((p) => ({ ...p, [locale]: val }));

  const setPricingRow = (idx: number, key: keyof ManagedPricingTier) => (val: string) =>
    setPricingTiersByLocale((prev) => {
      const rows = [...(prev[locale] ?? [])];
      while (rows.length < 3) rows.push({ label: "", price: "", note: "" });
      rows[idx] = { ...rows[idx], [key]: val };
      return { ...prev, [locale]: rows };
    });

  const patchIntroLt = (field: "eyebrow" | "title" | "desc", val: string) =>
    setHome((h) => ({
      ...h,
      intro: { ...h.intro, [field]: { ...h.intro[field], [locale]: val } },
    }));
  const patchBookingLt = (field: "eyebrow" | "title" | "desc" | "ctaCall" | "ctaReview", val: string) =>
    setHome((h) => ({
      ...h,
      booking: { ...h.booking, [field]: { ...h.booking[field], [locale]: val } },
    }));
  const patchReviewsLt = (field: "eyebrow" | "title", val: string) =>
    setHome((h) => ({
      ...h,
      reviews: { ...h.reviews, [field]: { ...h.reviews[field], [locale]: val } },
    }));
  const patchReviewSlot = (slot: "one" | "two" | "three", field: "content" | "author", val: string) =>
    setHome((h) => ({
      ...h,
      reviews: {
        ...h.reviews,
        [slot]: {
          ...h.reviews[slot],
          [field]: { ...h.reviews[slot][field], [locale]: val },
        },
      },
    }));
  const patchFaqLt = (field: "eyebrow" | "title", val: string) =>
    setHome((h) => ({
      ...h,
      faq: { ...h.faq, [field]: { ...h.faq[field], [locale]: val } },
    }));
  const patchFaqItem = (idx: number, field: "q" | "a", val: string) =>
    setHome((h) => {
      const items = [...h.faq.items];
      const pair = items[idx];
      items[idx] = { ...pair, [field]: { ...pair[field], [locale]: val } };
      return { ...h, faq: { ...h.faq, items: items as typeof h.faq.items } };
    });

  const patchSubBooking = (field: "title" | "description", val: string) =>
    setSubpages((s) => ({
      ...s,
      booking: { ...s.booking, [field]: { ...s.booking[field], [locale]: val } },
    }));
  const patchSubInquiry = (
    field:
      | "heroEyebrow"
      | "heroTitle"
      | "heroDesc"
      | "faqTitle"
      | "formTitle"
      | "formDesc"
      | "contactSectionTitle"
      | "contactSectionDesc",
    val: string,
  ) =>
    setSubpages((s) => ({
      ...s,
      inquiry: { ...s.inquiry, [field]: { ...s.inquiry[field], [locale]: val } },
    }));
  const patchSubInquiryFaq = (idx: number, field: "q" | "a", val: string) =>
    setSubpages((s) => {
      const next = [...s.inquiry.faqItems];
      next[idx] = { ...next[idx], [field]: { ...next[idx][field], [locale]: val } };
      return { ...s, inquiry: { ...s.inquiry, faqItems: next } };
    });
  const patchSubIntro = (
    field:
      | "brandTitle"
      | "sectionLabel"
      | "headline"
      | "description"
      | "coreValueEyebrow"
      | "coreValueTitle"
      | "coreValueBody"
      | "contactEyebrow"
      | "representativeName"
      | "representativeLine"
      | "phoneCaption",
    val: string,
  ) =>
    setSubpages((s) => ({
      ...s,
      intro: { ...s.intro, [field]: { ...s.intro[field], [locale]: val } },
    }));
  const patchSubIntroService = (idx: number, field: "title" | "body" | "image", val: string) =>
    setSubpages((s) => {
      const services = [...s.intro.services];
      if (field === "image") {
        services[idx] = { ...services[idx], image: val };
      } else {
        services[idx] = {
          ...services[idx],
          [field]: { ...services[idx][field], [locale]: val },
        };
      }
      return { ...s, intro: { ...s.intro, services } };
    });
  const patchSubReview = (field: "heroEyebrow" | "heroTitle" | "heroDesc", val: string) =>
    setSubpages((s) => ({
      ...s,
      review: { ...s.review, [field]: { ...s.review[field], [locale]: val } },
    }));

  // (legacy) /api/admin/gallery-upload 는 공통 업로더로 대체되었습니다.

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const pricingTiers =
      tiersLegacyFromKo(pricingTiersByLocale.ko).length > 0
        ? tiersLegacyFromKo(pricingTiersByLocale.ko)
        : initial.pricingTiers;
    const body = {
      aboutMeTitle: pickLegacyText(aboutMeTitleByLocale, initial.aboutMeTitle),
      aboutMeDescription: pickLegacyText(aboutMeDescriptionByLocale, initial.aboutMeDescription),
      galleryImageUrls: galleryPreview,
      vehicleSectionTitle: pickLegacyText(vehicleSectionTitleByLocale, initial.vehicleSectionTitle),
      vehicleSectionDescription: pickLegacyText(vehicleSectionDescriptionByLocale, initial.vehicleSectionDescription),
      pricingTiers,
      seoHomeTitle: pickLegacyText(seoHomeTitleByLocale, initial.seoHomeTitle),
      seoHomeDescription: pickLegacyText(seoHomeDescriptionByLocale, initial.seoHomeDescription),
      phoneDisplay,
      contactLinks: { kakao: kakaoUrl, instagram: instagramUrl, whatsapp: whatsappUrl, line: lineUrl, messenger: messengerUrl },
      heroTitle: pickLegacyText(heroTitleByLocale, initial.heroTitle),
      heroSubtitle: pickLegacyText(heroSubtitleByLocale, initial.heroSubtitle),
      aboutMeTitleByLocale,
      aboutMeDescriptionByLocale,
      heroTitleByLocale,
      heroSubtitleByLocale,
      seoHomeTitleByLocale,
      seoHomeDescriptionByLocale,
      vehicleSectionTitleByLocale,
      vehicleSectionDescriptionByLocale,
      pricingTiersByLocale,
      home,
      subpages,
    };
    const res = await fetch("/api/admin/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = (await res.json()) as { ok: boolean; message?: string };
    setSaving(false);
    const okText = "저장 완료! 홈페이지를 새로고침하면 반영됩니다.";
    setMessage(result.ok ? okText : (result.message ?? "저장 실패"));
    setToast({ type: result.ok ? "success" : "error", text: result.ok ? okText : (result.message ?? "저장 실패") });
    if (result.ok) {
      void fetch("/api/admin/change-logs?limit=15", { cache: "no-store" })
        .then((r) => r.json())
        .then((d: { ok?: boolean; logs?: Array<{ id: string; createdAt: string; summary: string }> }) => {
          if (d.ok && Array.isArray(d.logs)) setChangeLogs(d.logs);
        });
    }
  };

  const pricingRows =
    (pricingTiersByLocale[locale] ?? []).length > 0
      ? pricingTiersByLocale[locale]
      : (pricingTiersByLocale.ko ?? []).length > 0
        ? pricingTiersByLocale.ko
        : initial.pricingTiers.length > 0
          ? initial.pricingTiers
          : [{ label: "", price: "", note: "" }, { label: "", price: "", note: "" }, { label: "", price: "", note: "" }];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast ? (
        <div className={`fixed right-5 top-5 z-[260] max-w-sm rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${toast.type === "success" ? "border-emerald-400/40 bg-emerald-900/80 text-emerald-100" : "border-rose-400/40 bg-rose-900/80 text-rose-100"}`}>
          {toast.text}
        </div>
      ) : null}

      {/* Tab bar */}
      <div className="rounded-2xl border border-white/10 bg-[#070e1a] p-1.5">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              title={tab.desc}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-center text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-brand-gold text-black shadow-lg"
                  : "text-tone-strong hover:bg-white/5"
              }`}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              <span className="leading-tight">{tab.label.replace(/^[^\s]+\s/, "")}</span>
            </button>
          ))}
        </div>
      </div>

      {/* tab description */}
      <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-xs text-tone-soft">
        {visibleTabs.find((t) => t.id === activeTab)?.desc}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">

        {/* ── TAB: HOME ──────────────────────────────── */}
        {activeTab === "home" && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
            <h2 className="text-base font-bold text-tone-sky">🏠 홈 문구 관리</h2>
            <SectionNote where="홈페이지 상단(배경 슬라이드 + 큰 제목) 영역입니다. 빈 칸이면 기본 번역 문구가 노출됩니다." />

            <LocaleTabs selected={locale} onSelect={setLocale} />
            <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-tone-soft">
              현재 선택 언어(<strong>{locale.toUpperCase()}</strong>) 값이 비어 있으면, 한국어(ko) 값을 불러와 표시합니다.
              수정 후 저장하면 해당 언어 값으로 즉시 덮어씁니다.
            </div>

            <Field label={`히어로 큰 제목 (${locale.toUpperCase()})`} hint="홈 가장 상단의 대형 제목 텍스트입니다.">
              <Input value={heroTitleByLocale[locale]} onChange={setLocalized(setHeroTitleByLocale)} placeholder="예: 인천공항 Premium 콜밴" />
            </Field>

            <Field label={`히어로 서브타이틀 (${locale.toUpperCase()})`} hint="제목 아래 설명 문장입니다.">
              <Textarea value={heroSubtitleByLocale[locale]} onChange={setLocalized(setHeroSubtitleByLocale)} placeholder="예: 설레는 여행의 시작, 편안한 여행의 끝 깨비콜밴이 함께합니다." />
            </Field>

            <div className="border-t border-white/10 pt-4">
              <p className="mb-3 text-sm font-bold text-tone-soft">히어로 배경 슬라이드 이미지</p>
              <SectionNote where="갤러리 이미지와 별개입니다. 여기의 이미지는 홈 상단 배경 슬라이드로만 사용됩니다. 비워 두면 기존 HOME_INTRO_VISUALS + 차량 이미지가 그대로 사용됩니다." />
            </div>

            <div className="space-y-2">
              <AdminImageUploader
                section="home"
                purpose="hero-slide"
                label="슬라이드 이미지 추가"
                value={newHeroSlideUrl}
                onChange={setNewHeroSlideUrl}
                hint="업로드(또는 URL 입력) 후 ‘목록에 추가’를 누르세요."
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => { appendHeroSlideUrl(newHeroSlideUrl); setNewHeroSlideUrl(""); }}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-brand-gold to-[#b8892a] px-4 text-sm font-bold text-black disabled:opacity-50"
                  disabled={!newHeroSlideUrl.trim()}
                >
                  목록에 추가
                </button>
                <button
                  type="button"
                  onClick={() => setHome((p) => ({ ...p, heroVisuals: [] }))}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/20 bg-black/25 px-4 text-sm font-semibold text-tone-strong"
                >
                  기본값으로 되돌리기
                </button>
              </div>
            </div>

            {home.heroVisuals.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-tone-strong">현재 저장된 슬라이드 ({home.heroVisuals.length}개)</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {home.heroVisuals.map((src, idx) => (
                    <div key={`${src}-${idx}`} className="rounded-xl border border-white/12 bg-black/20 p-3">
                      <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black/30">
                        <Image src={src} alt={`히어로 슬라이드 ${idx + 1}`} fill unoptimized sizes="480px" className="object-cover" />
                      </div>
                      <p className="mt-2 truncate text-[10px] text-tone-soft">{src}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-semibold text-tone-strong disabled:opacity-40"
                          disabled={idx === 0}
                          onClick={() =>
                            setHome((p) => {
                              const next = [...p.heroVisuals];
                              const [item] = next.splice(idx, 1);
                              next.splice(idx - 1, 0, item);
                              return { ...p, heroVisuals: next };
                            })
                          }
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-semibold text-tone-strong disabled:opacity-40"
                          disabled={idx === home.heroVisuals.length - 1}
                          onClick={() =>
                            setHome((p) => {
                              const next = [...p.heroVisuals];
                              const [item] = next.splice(idx, 1);
                              next.splice(idx + 1, 0, item);
                              return { ...p, heroVisuals: next };
                            })
                          }
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="ml-auto rounded-lg bg-rose-700/90 px-3 py-1.5 text-xs font-semibold text-white"
                          onClick={() =>
                            setHome((p) => ({
                              ...p,
                              heroVisuals: p.heroVisuals.filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-tone-soft">
                저장된 슬라이드가 없습니다. 현재는 <strong>기본 슬라이드</strong>(HOME_INTRO_VISUALS + 차량 이미지)가 사용됩니다.
              </div>
            )}

            <div className="border-t border-white/10 pt-4">
              <p className="mb-3 text-sm font-bold text-tone-soft">About Me 섹션 (홈 중간 연락처 카드 위쪽)</p>
              <SectionNote where="홈페이지 연락처 카드 영역의 제목/설명입니다." />
            </div>

            <Field label={`About Me 제목 (${locale.toUpperCase()})`} hint="보통 'ABOUT ME' 등 짧은 레이블.">
              <Input value={aboutMeTitleByLocale[locale]} onChange={setLocalized(setAboutMeTitleByLocale)} placeholder="예: ABOUT ME" />
            </Field>

            <Field label={`About Me 설명 (${locale.toUpperCase()})`} hint="연락처 카드 영역의 한 줄~두 줄 소개 문장입니다.">
              <Textarea value={aboutMeDescriptionByLocale[locale]} onChange={setLocalized(setAboutMeDescriptionByLocale)} placeholder="예: 원하시는 채널로 빠르게 연결해 예약 상담을 도와드립니다." />
            </Field>

            <SaveBar saving={saving} message={message} />
          </div>
        )}

        {/* ── TAB: INTRO ─────────────────────────────── */}
        {activeTab === "intro" && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
            <h2 className="text-base font-bold text-tone-sky">📜 인트로 섹션 (홈 대형 소개)</h2>
            <SectionNote where={'IntroPage.hero와 동일 영역입니다. 칸을 비우면 messages 번역이 그대로 표시됩니다. 본문은 \'<brand>텍스트</brand>\' 형태로 브랜드 강조를 줄 수 있습니다.'} />

            <LocaleTabs selected={locale} onSelect={setLocale} />

            <Field label={`아이브로우 (${locale.toUpperCase()})`} hint="섹션 상단 작은 라벨">
              <Input value={home.intro.eyebrow[locale]} onChange={patchIntroLt.bind(null, "eyebrow")} />
            </Field>
            <Field label={`제목 (${locale.toUpperCase()})`}>
              <Input value={home.intro.title[locale]} onChange={patchIntroLt.bind(null, "title")} />
            </Field>
            <Field label={`본문 (${locale.toUpperCase()})`} hint={'여러 줄 가능. \'<brand>텍스트</brand>\' 로 강조합니다.'}>
              <Textarea rows={8} value={home.intro.desc[locale]} onChange={patchIntroLt.bind(null, "desc")} />
            </Field>

            <SaveBar saving={saving} message={message} />
          </div>
        )}

        {/* ── TAB: VEHICLE ──────────────────────────── */}
        {activeTab === "vehicle" && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
            <h2 className="text-base font-bold text-tone-sky">🚐 차량 섹션 관리</h2>
            <SectionNote where="홈페이지 'AIRPORT VAN FLEET' 섹션의 제목과 설명 문구입니다." />

            <LocaleTabs selected={locale} onSelect={setLocale} />

            <Field label={`차량 섹션 제목 (${locale.toUpperCase()})`} hint="예: '쾌적한 실내와 여유로운 적재 공간'">
              <Input value={vehicleSectionTitleByLocale[locale]} onChange={setLocalized(setVehicleSectionTitleByLocale)} placeholder="예: 쾌적한 실내와 여유로운 적재 공간" />
            </Field>

            <Field label={`차량 섹션 설명 (${locale.toUpperCase()})`} hint="차량 카드 아래 한 줄~두 줄 설명입니다.">
              <Textarea value={vehicleSectionDescriptionByLocale[locale]} onChange={setLocalized(setVehicleSectionDescriptionByLocale)} placeholder="예: 고객님의 인원과 목적에 맞는 다양한 프리미엄 차량이 준비되어 있습니다." />
            </Field>

            {/* 차량 이미지 안내 */}
            <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/8 p-4 text-xs leading-relaxed text-brand-gold">
              <p className="mb-2 font-bold text-sm">🚐 차량 이미지 교체 안내</p>
              <p className="mb-1 font-semibold text-white/80">외관(메인) 이미지</p>
              <ul className="mb-3 space-y-0.5 text-white/60">
                <li>• 스타리아 → <code className="rounded bg-black/30 px-1">public/images/vehicles/staria-hero.png</code></li>
                <li>• 쏠라티 → <code className="rounded bg-black/30 px-1">public/images/vehicles/solati-hero.png</code></li>
                <li>• 카운티 → <code className="rounded bg-black/30 px-1">public/images/vehicles/county-hero.png</code></li>
              </ul>
              <p className="mb-1 font-semibold text-white/80">실내(상세) 이미지 (최대 각 6장)</p>
              <p className="text-white/60">폴더에 파일을 넣은 뒤 개발자에게 경로 등록을 요청하세요.</p>
              <ul className="mt-1 space-y-0.5 text-white/60">
                <li>• 스타리아 → <code className="rounded bg-black/30 px-1">public/images/vehicles/interiors/staria-01.jpg</code> … </li>
                <li>• 쏠라티 → <code className="rounded bg-black/30 px-1">public/images/vehicles/interiors/solati-01.jpg</code> … </li>
                <li>• 카운티 → <code className="rounded bg-black/30 px-1">public/images/vehicles/interiors/county-01.jpg</code> … </li>
              </ul>
            </div>

            <SaveBar saving={saving} message={message} />
          </div>
        )}

        {/* ── TAB: PRICING ──────────────────────────── */}
        {activeTab === "pricing" && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
            <h2 className="text-base font-bold text-tone-sky">💰 홈 요금 카드 관리</h2>
            <SectionNote where="홈페이지 메인(첫 화면 아래) 요금 카드 3개를 수정합니다. ※ 요금안내 페이지(/pricing)의 상세 지역별 표는 아직 별도 데이터입니다." />

            <LocaleTabs selected={locale} onSelect={setLocale} />

            <div className="space-y-4">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="rounded-xl border border-white/12 bg-black/20 p-4">
                  <p className="mb-3 text-xs font-bold text-brand-gold">항목 {idx + 1}</p>
                  <div className="space-y-2">
                    <Field label="항목 제목" hint={idx === 0 ? "예: 공항 픽업/샌딩" : idx === 1 ? "예: 시내/근교 이동" : "예: 반일/종일 대절"}>
                      <Input value={pricingRows[idx]?.label ?? ""} onChange={setPricingRow(idx, "label")} placeholder={idx === 0 ? "공항 픽업/샌딩" : idx === 1 ? "시내/근교 이동" : "반일/종일 대절"} />
                    </Field>
                    <Field label="금액 표시" hint="예: 문의 후 확정, ¥○○○○〜, 견적 상담 등">
                      <Input value={pricingRows[idx]?.price ?? ""} onChange={setPricingRow(idx, "price")} placeholder="예: 문의 후 확정" />
                    </Field>
                    <Field label="안내 문구" hint="카드 하단 작은 설명 텍스트입니다.">
                      <Textarea rows={2} value={pricingRows[idx]?.note ?? ""} onChange={setPricingRow(idx, "note")} placeholder="예: 시간대/구간에 따라 변동됩니다." />
                    </Field>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-tone-soft">
              💡 <strong>ko(한국어)</strong>에 값을 입력하면 언어별 설정을 넣지 않은 경우 한국어 값이 기본으로 사용됩니다. 각 언어별로 다른 문구를 원하면 언어탭을 전환해 입력하세요.
            </div>

            <SaveBar saving={saving} message={message} />
          </div>
        )}

        {/* ── TAB: GALLERY ──────────────────────────── */}
        {activeTab === "gallery" && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
            <h2 className="text-base font-bold text-tone-sky">🖼 갤러리 이미지 관리</h2>
            <SectionNote where="홈페이지 About Me 카드 아래의 서비스 갤러리 이미지 섹션입니다. 이미지가 없으면 섹션 자체가 숨겨집니다." />

            <div className="space-y-2">
              <AdminImageUploader
                section="home"
                purpose="gallery"
                label="갤러리 이미지 추가"
                value={newGalleryUrl}
                onChange={setNewGalleryUrl}
                hint="업로드 후 ‘목록에 추가’를 눌러 갤러리에 반영하세요. URL 직접 입력도 가능합니다."
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => { appendGalleryUrl(newGalleryUrl); setNewGalleryUrl(""); }}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-brand-gold to-[#b8892a] px-4 text-sm font-bold text-black disabled:opacity-50"
                  disabled={!newGalleryUrl.trim()}
                >
                  목록에 추가
                </button>
                <p className="text-xs text-tone-soft">추가 후 저장하면 공개 홈에 반영됩니다.</p>
              </div>
            </div>

            {galleryPreview.length > 0 ? (
              <div>
                <p className="mb-2 text-xs font-semibold text-tone-strong">현재 등록된 이미지 ({galleryPreview.length}개)</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {galleryPreview.map((src, i) => (
                    <div key={src} className="group relative overflow-hidden rounded-xl border border-white/12 bg-black/30">
                      <div className="relative aspect-video overflow-hidden">
                        <Image src={src} alt={`갤러리 ${i + 1}`} fill unoptimized sizes="240px" className="object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setGalleryText((p) => p.split("\n").map((l) => l.trim()).filter((l) => l && l !== src).join("\n"))}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-700/90 text-white opacity-0 transition group-hover:opacity-100"
                        title="제거"
                      >
                        ✕
                      </button>
                      <p className="truncate px-2 py-1.5 text-[10px] text-tone-soft">{src}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-tone-soft">
                아직 이미지가 없습니다.
              </div>
            )}

            <Field label="이미지 URL 목록 (한 줄에 1개)" hint="파일을 업로드하거나, 외부 URL을 직접 붙여 넣어도 됩니다.">
              <Textarea rows={5} value={galleryText} onChange={setGalleryText} placeholder="/images/gallery/photo1.jpg" />
            </Field>

            <SaveBar saving={saving} message={message} />
          </div>
        )}

        {/* ── TAB: CONTACT ──────────────────────────── */}
        {activeTab === "contact" && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
            <h2 className="text-base font-bold text-tone-sky">📞 연락처 & 채널 링크 관리</h2>
            <SectionNote where="헤더 전화번호 및 퀵메뉴(WhatsApp·카카오·LINE 등) 버튼 링크가 변경됩니다." />

            <Field label="헤더 전화번호 표시 (한국형)" hint="예: 010-4135-7621 — 저장하면 헤더와 버튼에 반영됩니다. 변경 시 실제 통화 링크도 자동 업데이트됩니다.">
              <Input value={phoneDisplay} onChange={setPhoneDisplay} placeholder="010-4135-7621" />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="카카오톡 오픈채팅 URL" hint="카카오 채널/오픈채팅 링크를 붙여 넣으세요.">
                <Input value={kakaoUrl} onChange={setKakaoUrl} placeholder="https://pf.kakao.com/..." />
              </Field>
              <Field label="WhatsApp URL" hint="wa.me/821012345678 형식 권장">
                <Input value={whatsappUrl} onChange={setWhatsappUrl} placeholder="https://wa.me/821041357621" />
              </Field>
              <Field label="LINE URL" hint="line.me/ti/p/~계정명 형식">
                <Input value={lineUrl} onChange={setLineUrl} placeholder="https://line.me/ti/p/~id" />
              </Field>
              <Field label="Instagram DM URL">
                <Input value={instagramUrl} onChange={setInstagramUrl} placeholder="https://www.instagram.com/..." />
              </Field>
              <Field label="Facebook Messenger URL" hint="fb-messenger:// 또는 m.me/... 형식">
                <Input value={messengerUrl} onChange={setMessengerUrl} placeholder="https://m.me/..." className="sm:col-span-2" />
              </Field>
            </div>

            <SaveBar saving={saving} message={message} />
          </div>
        )}

        {/* ── TAB: BOOKING ───────────────────────────── */}
        {activeTab === "booking" && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
            <h2 className="text-base font-bold text-tone-sky">📅 온라인 예약 CTA 섹션</h2>
            <SectionNote where="홈에서 예약 유도 블록입니다. 비어 있으면 Booking 섹션 기본 번역이 사용됩니다." />

            <LocaleTabs selected={locale} onSelect={setLocale} />

            <Field label={`아이브로우 (${locale.toUpperCase()})`}>
              <Input value={home.booking.eyebrow[locale]} onChange={patchBookingLt.bind(null, "eyebrow")} />
              {hint(home.booking.eyebrow[locale], fallbackHints.booking.eyebrow[locale]) ? (
                <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.booking.eyebrow[locale]}</p>
              ) : null}
            </Field>
            <Field label={`제목 (${locale.toUpperCase()})`}>
              <Input value={home.booking.title[locale]} onChange={patchBookingLt.bind(null, "title")} />
              {hint(home.booking.title[locale], fallbackHints.booking.title[locale]) ? (
                <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.booking.title[locale]}</p>
              ) : null}
            </Field>
            <Field label={`설명 (${locale.toUpperCase()})`}>
              <Textarea rows={4} value={home.booking.desc[locale]} onChange={patchBookingLt.bind(null, "desc")} />
              {hint(home.booking.desc[locale], fallbackHints.booking.desc[locale]) ? (
                <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.booking.desc[locale]}</p>
              ) : null}
            </Field>
            <Field label={`예약 버튼 문구 (${locale.toUpperCase()})`}>
              <Input value={home.booking.ctaCall[locale]} onChange={patchBookingLt.bind(null, "ctaCall")} />
              {hint(home.booking.ctaCall[locale], fallbackHints.booking.ctaCall[locale]) ? (
                <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.booking.ctaCall[locale]}</p>
              ) : null}
            </Field>
            <Field label={`후기 버튼 문구 (${locale.toUpperCase()})`}>
              <Input value={home.booking.ctaReview[locale]} onChange={patchBookingLt.bind(null, "ctaReview")} />
              {hint(home.booking.ctaReview[locale], fallbackHints.booking.ctaReview[locale]) ? (
                <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.booking.ctaReview[locale]}</p>
              ) : null}
            </Field>

            <SaveBar saving={saving} message={message} />
          </div>
        )}

        {/* ── TAB: REVIEWS ───────────────────────────── */}
        {activeTab === "reviews" && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
            <h2 className="text-base font-bold text-tone-sky">⭐ 고객 후기 (홈 3건)</h2>
            <SectionNote where="홈 후기 카드 3개입니다. 비어 있으면 messages의 후기 문구가 fallback 됩니다." />

            <LocaleTabs selected={locale} onSelect={setLocale} />

            <Field label={`섹션 아이브로우 (${locale.toUpperCase()})`}>
              <Input value={home.reviews.eyebrow[locale]} onChange={patchReviewsLt.bind(null, "eyebrow")} />
              {hint(home.reviews.eyebrow[locale], fallbackHints.reviews.eyebrow[locale]) ? (
                <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.reviews.eyebrow[locale]}</p>
              ) : null}
            </Field>
            <Field label={`섹션 제목 (${locale.toUpperCase()})`}>
              <Input value={home.reviews.title[locale]} onChange={patchReviewsLt.bind(null, "title")} />
              {hint(home.reviews.title[locale], fallbackHints.reviews.title[locale]) ? (
                <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.reviews.title[locale]}</p>
              ) : null}
            </Field>

            {(["one", "two", "three"] as const).map((slot, i) => (
              <div key={slot} className="space-y-3 rounded-xl border border-white/12 bg-black/20 p-4">
                <p className="text-xs font-bold text-brand-gold">후기 {i + 1}</p>
                <Field label={`본문 (${locale.toUpperCase()})`}>
                  <Textarea rows={4} value={home.reviews[slot].content[locale]} onChange={patchReviewSlot.bind(null, slot, "content")} />
                  {hint(home.reviews[slot].content[locale], fallbackHints.reviews[slot].content[locale]) ? (
                    <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.reviews[slot].content[locale]}</p>
                  ) : null}
                </Field>
                <Field label={`출처/이름 (${locale.toUpperCase()})`}>
                  <Input value={home.reviews[slot].author[locale]} onChange={patchReviewSlot.bind(null, slot, "author")} />
                  {hint(home.reviews[slot].author[locale], fallbackHints.reviews[slot].author[locale]) ? (
                    <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.reviews[slot].author[locale]}</p>
                  ) : null}
                </Field>
              </div>
            ))}

            <SaveBar saving={saving} message={message} />
          </div>
        )}

        {/* ── TAB: FAQ ──────────────────────────────── */}
        {activeTab === "faq" && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
            <h2 className="text-base font-bold text-tone-sky">❓ FAQ (홈 5개)</h2>
            <SectionNote where="홈 하단 FAQ입니다. 비어 있으면 messages FAQ 번역이 사용됩니다." />

            <LocaleTabs selected={locale} onSelect={setLocale} />

            <Field label={`섹션 아이브로우 (${locale.toUpperCase()})`}>
              <Input value={home.faq.eyebrow[locale]} onChange={patchFaqLt.bind(null, "eyebrow")} />
              {hint(home.faq.eyebrow[locale], fallbackHints.faq.eyebrow[locale]) ? (
                <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.faq.eyebrow[locale]}</p>
              ) : null}
            </Field>
            <Field label={`섹션 제목 (${locale.toUpperCase()})`}>
              <Input value={home.faq.title[locale]} onChange={patchFaqLt.bind(null, "title")} />
              {hint(home.faq.title[locale], fallbackHints.faq.title[locale]) ? (
                <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.faq.title[locale]}</p>
              ) : null}
            </Field>

            {home.faq.items.map((pair, idx) => (
              <div key={idx} className="space-y-3 rounded-xl border border-white/12 bg-black/20 p-4">
                <p className="text-xs font-bold text-brand-gold">질문 {idx + 1}</p>
                <Field label={`질문 (${locale.toUpperCase()})`}>
                  <Textarea rows={2} value={pair.q[locale]} onChange={(v) => patchFaqItem(idx, "q", v)} />
                  {hint(pair.q[locale], fallbackHints.faq.items[idx].q[locale]) ? (
                    <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.faq.items[idx].q[locale]}</p>
                  ) : null}
                </Field>
                <Field label={`답변 (${locale.toUpperCase()})`}>
                  <Textarea rows={4} value={pair.a[locale]} onChange={(v) => patchFaqItem(idx, "a", v)} />
                  {hint(pair.a[locale], fallbackHints.faq.items[idx].a[locale]) ? (
                    <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.faq.items[idx].a[locale]}</p>
                  ) : null}
                </Field>
              </div>
            ))}

            <SaveBar saving={saving} message={message} />
          </div>
        )}

        {activeTab === "subpages" && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
            <h2 className="text-base font-bold text-tone-sky">📄 서브페이지 본문 CMS</h2>
            <SectionNote where="/booking, /inquiry, /intro, /review 본문을 편집합니다. 비어 있으면 기존 messages 번역이 fallback 됩니다." />
            <LocaleTabs selected={locale} onSelect={setLocale} />

            <div className="space-y-4 rounded-xl border border-white/12 bg-black/20 p-4">
              <p className="text-sm font-bold text-tone-strong">/booking</p>
              <Field label={`본문 제목 (${locale.toUpperCase()})`}>
                <Input value={subpages.booking.title[locale]} onChange={patchSubBooking.bind(null, "title")} />
                {hint(subpages.booking.title[locale], fallbackHints.subpages.booking.title[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.booking.title[locale]}</p>
                ) : null}
              </Field>
              <Field label={`본문 설명 (${locale.toUpperCase()})`}>
                <Textarea rows={4} value={subpages.booking.description[locale]} onChange={patchSubBooking.bind(null, "description")} />
                {hint(subpages.booking.description[locale], fallbackHints.subpages.booking.description[locale]) ? (
                  <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.booking.description[locale]}</p>
                ) : null}
              </Field>
            </div>

            <div className="space-y-4 rounded-xl border border-white/12 bg-black/20 p-4">
              <p className="text-sm font-bold text-tone-strong">/review 상단 히어로</p>
              <Field label={`아이브로우 (${locale.toUpperCase()})`}>
                <Input value={subpages.review.heroEyebrow[locale]} onChange={patchSubReview.bind(null, "heroEyebrow")} />
                {hint(subpages.review.heroEyebrow[locale], fallbackHints.subpages.review.heroEyebrow[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.review.heroEyebrow[locale]}</p>
                ) : null}
              </Field>
              <Field label={`제목 (${locale.toUpperCase()})`}>
                <Input value={subpages.review.heroTitle[locale]} onChange={patchSubReview.bind(null, "heroTitle")} />
                {hint(subpages.review.heroTitle[locale], fallbackHints.subpages.review.heroTitle[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.review.heroTitle[locale]}</p>
                ) : null}
              </Field>
              <Field label={`설명 (${locale.toUpperCase()})`}>
                <Textarea rows={4} value={subpages.review.heroDesc[locale]} onChange={patchSubReview.bind(null, "heroDesc")} />
                {hint(subpages.review.heroDesc[locale], fallbackHints.subpages.review.heroDesc[locale]) ? (
                  <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.review.heroDesc[locale]}</p>
                ) : null}
              </Field>
            </div>

            <div className="space-y-4 rounded-xl border border-white/12 bg-black/20 p-4">
              <p className="text-sm font-bold text-tone-strong">/inquiry 본문 + FAQ</p>
              <Field label={`히어로 아이브로우 (${locale.toUpperCase()})`}>
                <Input value={subpages.inquiry.heroEyebrow[locale]} onChange={patchSubInquiry.bind(null, "heroEyebrow")} />
                {hint(subpages.inquiry.heroEyebrow[locale], fallbackHints.subpages.inquiry.heroEyebrow[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.inquiry.heroEyebrow[locale]}</p>
                ) : null}
              </Field>
              <Field label={`히어로 제목 (${locale.toUpperCase()})`}>
                <Input value={subpages.inquiry.heroTitle[locale]} onChange={patchSubInquiry.bind(null, "heroTitle")} />
                {hint(subpages.inquiry.heroTitle[locale], fallbackHints.subpages.inquiry.heroTitle[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.inquiry.heroTitle[locale]}</p>
                ) : null}
              </Field>
              <Field label={`히어로 설명 (${locale.toUpperCase()})`}>
                <Textarea rows={4} value={subpages.inquiry.heroDesc[locale]} onChange={patchSubInquiry.bind(null, "heroDesc")} />
                {hint(subpages.inquiry.heroDesc[locale], fallbackHints.subpages.inquiry.heroDesc[locale]) ? (
                  <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.inquiry.heroDesc[locale]}</p>
                ) : null}
              </Field>
              <Field label={`FAQ 섹션 제목 (${locale.toUpperCase()})`}>
                <Input value={subpages.inquiry.faqTitle[locale]} onChange={patchSubInquiry.bind(null, "faqTitle")} />
                {hint(subpages.inquiry.faqTitle[locale], fallbackHints.subpages.inquiry.faqTitle[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.inquiry.faqTitle[locale]}</p>
                ) : null}
              </Field>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <p className="mb-2 text-xs font-semibold text-tone-soft">FAQ {i + 1}</p>
                  <Field label={`질문 (${locale.toUpperCase()})`}>
                    <Textarea rows={2} value={subpages.inquiry.faqItems[i].q[locale]} onChange={(v) => patchSubInquiryFaq(i, "q", v)} />
                    {hint(subpages.inquiry.faqItems[i].q[locale], fallbackHints.subpages.inquiry.faqItems[i].q[locale]) ? (
                      <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.inquiry.faqItems[i].q[locale]}</p>
                    ) : null}
                  </Field>
                  <Field label={`답변 (${locale.toUpperCase()})`}>
                    <Textarea rows={3} value={subpages.inquiry.faqItems[i].a[locale]} onChange={(v) => patchSubInquiryFaq(i, "a", v)} />
                    {hint(subpages.inquiry.faqItems[i].a[locale], fallbackHints.subpages.inquiry.faqItems[i].a[locale]) ? (
                      <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.inquiry.faqItems[i].a[locale]}</p>
                    ) : null}
                  </Field>
                </div>
              ))}
              <Field label={`폼 제목 (${locale.toUpperCase()})`}>
                <Input value={subpages.inquiry.formTitle[locale]} onChange={patchSubInquiry.bind(null, "formTitle")} />
                {hint(subpages.inquiry.formTitle[locale], fallbackHints.subpages.inquiry.formTitle[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.inquiry.formTitle[locale]}</p>
                ) : null}
              </Field>
              <Field label={`폼 설명 (${locale.toUpperCase()})`}>
                <Textarea rows={3} value={subpages.inquiry.formDesc[locale]} onChange={patchSubInquiry.bind(null, "formDesc")} />
                {hint(subpages.inquiry.formDesc[locale], fallbackHints.subpages.inquiry.formDesc[locale]) ? (
                  <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.inquiry.formDesc[locale]}</p>
                ) : null}
              </Field>
              <Field label={`문의채널 제목 (${locale.toUpperCase()})`}>
                <Input value={subpages.inquiry.contactSectionTitle[locale]} onChange={patchSubInquiry.bind(null, "contactSectionTitle")} />
                {hint(subpages.inquiry.contactSectionTitle[locale], fallbackHints.subpages.inquiry.contactSectionTitle[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.inquiry.contactSectionTitle[locale]}</p>
                ) : null}
              </Field>
              <Field label={`문의채널 설명 (${locale.toUpperCase()})`}>
                <Textarea rows={3} value={subpages.inquiry.contactSectionDesc[locale]} onChange={patchSubInquiry.bind(null, "contactSectionDesc")} />
                {hint(subpages.inquiry.contactSectionDesc[locale], fallbackHints.subpages.inquiry.contactSectionDesc[locale]) ? (
                  <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.inquiry.contactSectionDesc[locale]}</p>
                ) : null}
              </Field>
            </div>

            <div className="space-y-4 rounded-xl border border-white/12 bg-black/20 p-4">
              <p className="text-sm font-bold text-tone-strong">/intro 본문 + 서비스 이미지</p>
              <Field label={`브랜드 타이틀 (${locale.toUpperCase()})`}>
                <Input value={subpages.intro.brandTitle[locale]} onChange={patchSubIntro.bind(null, "brandTitle")} />
                {hint(subpages.intro.brandTitle[locale], fallbackHints.subpages.intro.brandTitle[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.brandTitle[locale]}</p>
                ) : null}
              </Field>
              <Field label={`섹션 라벨 (${locale.toUpperCase()})`}>
                <Input value={subpages.intro.sectionLabel[locale]} onChange={patchSubIntro.bind(null, "sectionLabel")} />
                {hint(subpages.intro.sectionLabel[locale], fallbackHints.subpages.intro.sectionLabel[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.sectionLabel[locale]}</p>
                ) : null}
              </Field>
              <Field label={`헤드라인 (${locale.toUpperCase()})`}>
                <Input value={subpages.intro.headline[locale]} onChange={patchSubIntro.bind(null, "headline")} />
                {hint(subpages.intro.headline[locale], fallbackHints.subpages.intro.headline[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.headline[locale]}</p>
                ) : null}
              </Field>
              <Field label={`히어로 본문 (${locale.toUpperCase()})`} hint={"<brand>강조</brand> 태그를 사용할 수 있습니다."}>
                <Textarea rows={5} value={subpages.intro.description[locale]} onChange={patchSubIntro.bind(null, "description")} />
                {hint(subpages.intro.description[locale], fallbackHints.subpages.intro.description[locale]) ? (
                  <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.description[locale]}</p>
                ) : null}
              </Field>
              <Field label={`CoreValue 아이브로우 (${locale.toUpperCase()})`}>
                <Input value={subpages.intro.coreValueEyebrow[locale]} onChange={patchSubIntro.bind(null, "coreValueEyebrow")} />
                {hint(subpages.intro.coreValueEyebrow[locale], fallbackHints.subpages.intro.coreValueEyebrow[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.coreValueEyebrow[locale]}</p>
                ) : null}
              </Field>
              <Field label={`CoreValue 제목 (${locale.toUpperCase()})`}>
                <Input value={subpages.intro.coreValueTitle[locale]} onChange={patchSubIntro.bind(null, "coreValueTitle")} />
                {hint(subpages.intro.coreValueTitle[locale], fallbackHints.subpages.intro.coreValueTitle[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.coreValueTitle[locale]}</p>
                ) : null}
              </Field>
              <Field label={`CoreValue 본문 (${locale.toUpperCase()})`}>
                <Textarea rows={4} value={subpages.intro.coreValueBody[locale]} onChange={patchSubIntro.bind(null, "coreValueBody")} />
                {hint(subpages.intro.coreValueBody[locale], fallbackHints.subpages.intro.coreValueBody[locale]) ? (
                  <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.coreValueBody[locale]}</p>
                ) : null}
              </Field>
              <Field label={`문의 아이브로우 (${locale.toUpperCase()})`}>
                <Input value={subpages.intro.contactEyebrow[locale]} onChange={patchSubIntro.bind(null, "contactEyebrow")} />
                {hint(subpages.intro.contactEyebrow[locale], fallbackHints.subpages.intro.contactEyebrow[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.contactEyebrow[locale]}</p>
                ) : null}
              </Field>
              <Field label={`대표명 (${locale.toUpperCase()})`}>
                <Input value={subpages.intro.representativeName[locale]} onChange={patchSubIntro.bind(null, "representativeName")} />
                {hint(subpages.intro.representativeName[locale], fallbackHints.subpages.intro.representativeName[locale]) ? (
                  <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.representativeName[locale]}</p>
                ) : null}
              </Field>
              <Field label={`대표 라인 (${locale.toUpperCase()})`}>
                <Textarea rows={3} value={subpages.intro.representativeLine[locale]} onChange={patchSubIntro.bind(null, "representativeLine")} />
                {hint(subpages.intro.representativeLine[locale], fallbackHints.subpages.intro.representativeLine[locale]) ? (
                  <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.representativeLine[locale]}</p>
                ) : null}
              </Field>
              <Field label={`전화 캡션 (${locale.toUpperCase()})`}>
                <Textarea rows={2} value={subpages.intro.phoneCaption[locale]} onChange={patchSubIntro.bind(null, "phoneCaption")} />
                {hint(subpages.intro.phoneCaption[locale], fallbackHints.subpages.intro.phoneCaption[locale]) ? (
                  <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.phoneCaption[locale]}</p>
                ) : null}
              </Field>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <p className="mb-2 text-xs font-semibold text-tone-soft">서비스 블록 {i + 1}</p>
                  <Field label={`서비스 제목 (${locale.toUpperCase()})`}>
                    <Input value={subpages.intro.services[i].title[locale]} onChange={(v) => patchSubIntroService(i, "title", v)} />
                    {hint(subpages.intro.services[i].title[locale], fallbackHints.subpages.intro.services[i].title[locale]) ? (
                      <p className="text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.services[i].title[locale]}</p>
                    ) : null}
                  </Field>
                  <Field label={`서비스 본문 (${locale.toUpperCase()})`}>
                    <Textarea rows={4} value={subpages.intro.services[i].body[locale]} onChange={(v) => patchSubIntroService(i, "body", v)} />
                    {hint(subpages.intro.services[i].body[locale], fallbackHints.subpages.intro.services[i].body[locale]) ? (
                      <p className="whitespace-pre-line text-xs text-tone-soft">현재 기본값: {fallbackHints.subpages.intro.services[i].body[locale]}</p>
                    ) : null}
                  </Field>
                  <AdminImageUploader
                    section="intro"
                    purpose={`service-${i + 1}`}
                    label={`서비스 이미지 ${i + 1}`}
                    value={subpages.intro.services[i].image}
                    onChange={(v) => patchSubIntroService(i, "image", v)}
                    hint="이미지는 공통 URL로 사용됩니다."
                  />
                </div>
              ))}
            </div>
            <SaveBar saving={saving} message={message} />
          </div>
        )}

      </form>

      {/* Change log */}
      {changeLogs.length > 0 && (
        <section className="rounded-2xl border border-white/10 bg-[#070d17] p-5">
          <h3 className="mb-3 text-sm font-bold text-tone-strong">🕓 최근 변경 이력</h3>
          <ul className="space-y-1.5">
            {changeLogs.map((log) => (
              <li key={log.id} className="flex items-start gap-3 rounded-lg border border-white/8 bg-black/20 px-3 py-2 text-xs">
                <span className="shrink-0 text-tone-soft">{new Date(log.createdAt).toLocaleString("ko-KR")}</span>
                <span className="text-tone-strong">{log.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
