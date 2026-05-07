"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type {
  LocaleKey,
  LocalizedPricingTiers,
  LocalizedText,
  ManagedPricingTier,
  SiteSettings,
} from "@/lib/site-settings-store";

type Props = {
  initial: SiteSettings;
};

function pickLegacyText(by: LocalizedText, fallback: string): string {
  const v =
    by.ko.trim() || by.en.trim() || by.ja.trim() || by.zh.trim() || fallback.trim();
  return v;
}

function tiersLegacyFromKo(rows: ManagedPricingTier[] | undefined): ManagedPricingTier[] {
  if (!rows?.length) return [];
  return rows
    .map((row) => ({
      label: row.label.trim(),
      price: row.price.trim(),
      note: row.note.trim(),
    }))
    .filter((row) => row.label && row.price && row.note);
}

export function AdminSiteSettingsForm({ initial }: Props) {
  const localeOptions: LocaleKey[] = ["ko", "en", "ja", "zh"];
  const [selectedLocale, setSelectedLocale] = useState<LocaleKey>("ko");
  const [galleryText, setGalleryText] = useState(initial.galleryImageUrls.join("\n"));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [changeLogs, setChangeLogs] = useState<
    Array<{ id: string; createdAt: string; summary: string }>
  >([]);
  const [phoneDisplay, setPhoneDisplay] = useState(initial.phoneDisplay);
  const [kakaoUrl, setKakaoUrl] = useState(initial.contactLinks.kakao);
  const [instagramUrl, setInstagramUrl] = useState(initial.contactLinks.instagram);
  const [whatsappUrl, setWhatsappUrl] = useState(initial.contactLinks.whatsapp);
  const [lineUrl, setLineUrl] = useState(initial.contactLinks.line);
  const [messengerUrl, setMessengerUrl] = useState(initial.contactLinks.messenger);
  const [aboutMeTitleByLocale, setAboutMeTitleByLocale] = useState<LocalizedText>(
    initial.aboutMeTitleByLocale
  );
  const [aboutMeDescriptionByLocale, setAboutMeDescriptionByLocale] = useState<LocalizedText>(
    initial.aboutMeDescriptionByLocale
  );
  const [heroTitleByLocale, setHeroTitleByLocale] = useState<LocalizedText>(initial.heroTitleByLocale);
  const [heroSubtitleByLocale, setHeroSubtitleByLocale] = useState<LocalizedText>(
    initial.heroSubtitleByLocale
  );
  const [seoHomeTitleByLocale, setSeoHomeTitleByLocale] = useState<LocalizedText>(
    initial.seoHomeTitleByLocale
  );
  const [seoHomeDescriptionByLocale, setSeoHomeDescriptionByLocale] = useState<LocalizedText>(
    initial.seoHomeDescriptionByLocale
  );
  const [vehicleSectionTitleByLocale, setVehicleSectionTitleByLocale] = useState<LocalizedText>(
    initial.vehicleSectionTitleByLocale
  );
  const [vehicleSectionDescriptionByLocale, setVehicleSectionDescriptionByLocale] =
    useState<LocalizedText>(initial.vehicleSectionDescriptionByLocale);
  const [pricingTiersByLocale, setPricingTiersByLocale] = useState<LocalizedPricingTiers>(
    initial.pricingTiersByLocale
  );

  const galleryPreview = useMemo(
    () =>
      galleryText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [galleryText]
  );

  useEffect(() => {
    const timer = toast ? window.setTimeout(() => setToast(null), 2800) : null;
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [toast]);

  useEffect(() => {
    const loadLogs = async () => {
      const res = await fetch("/api/admin/change-logs?limit=20", { cache: "no-store" });
      const data = (await res.json()) as {
        ok?: boolean;
        logs?: Array<{ id: string; createdAt: string; summary: string }>;
      };
      if (data.ok && Array.isArray(data.logs)) {
        setChangeLogs(data.logs);
      }
    };
    void loadLogs();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    /** Supabase·레거시 컬럼은 한국어 로케일 값을 우선으로 동기화 (미입력 시 다른 언어 → 초기값) */
    const aboutMeTitle = pickLegacyText(aboutMeTitleByLocale, initial.aboutMeTitle);
    const aboutMeDescription = pickLegacyText(
      aboutMeDescriptionByLocale,
      initial.aboutMeDescription,
    );
    const heroTitle = pickLegacyText(heroTitleByLocale, initial.heroTitle);
    const heroSubtitle = pickLegacyText(heroSubtitleByLocale, initial.heroSubtitle);
    const seoHomeTitle = pickLegacyText(seoHomeTitleByLocale, initial.seoHomeTitle);
    const seoHomeDescription = pickLegacyText(
      seoHomeDescriptionByLocale,
      initial.seoHomeDescription,
    );
    const vehicleSectionTitle = pickLegacyText(
      vehicleSectionTitleByLocale,
      initial.vehicleSectionTitle,
    );
    const vehicleSectionDescription = pickLegacyText(
      vehicleSectionDescriptionByLocale,
      initial.vehicleSectionDescription,
    );
    const pricingTiers =
      tiersLegacyFromKo(pricingTiersByLocale.ko).length > 0
        ? tiersLegacyFromKo(pricingTiersByLocale.ko)
        : tiersLegacyFromKo(initial.pricingTiersByLocale.ko).length > 0
          ? tiersLegacyFromKo(initial.pricingTiersByLocale.ko)
          : initial.pricingTiers;

    const response = await fetch("/api/admin/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aboutMeTitle,
        aboutMeDescription,
        galleryImageUrls: galleryPreview,
        vehicleSectionTitle,
        vehicleSectionDescription,
        pricingTiers,
        seoHomeTitle,
        seoHomeDescription,
        phoneDisplay,
        contactLinks: {
          kakao: kakaoUrl,
          instagram: instagramUrl,
          whatsapp: whatsappUrl,
          line: lineUrl,
          messenger: messengerUrl,
        },
        heroTitle,
        heroSubtitle,
        aboutMeTitleByLocale,
        aboutMeDescriptionByLocale,
        heroTitleByLocale,
        heroSubtitleByLocale,
        seoHomeTitleByLocale,
        seoHomeDescriptionByLocale,
        vehicleSectionTitleByLocale,
        vehicleSectionDescriptionByLocale,
        pricingTiersByLocale,
      }),
    });

    const result = (await response.json()) as { ok: boolean; message?: string };
    setSaving(false);
    const okText = "저장되었습니다. 홈 화면 새로고침 후 반영 확인해 주세요.";
    const errText = result.message ?? "저장 실패";
    setMessage(result.ok ? okText : errText);
    setToast({ type: result.ok ? "success" : "error", text: result.ok ? okText : errText });
    if (result.ok) {
      const res = await fetch("/api/admin/change-logs?limit=20", { cache: "no-store" });
      const data = (await res.json()) as {
        ok?: boolean;
        logs?: Array<{ id: string; createdAt: string; summary: string }>;
      };
      if (data.ok && Array.isArray(data.logs)) {
        setChangeLogs(data.logs);
      }
    }
  };

  const onUploadImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setMessage("");

    const fd = new FormData();
    fd.set("file", file);
    const response = await fetch("/api/admin/gallery-upload", { method: "POST", body: fd });
    const result = (await response.json()) as { ok: boolean; url?: string; message?: string };
    setUploading(false);
    if (!result.ok || !result.url) {
      setMessage(result.message ?? "이미지 업로드 실패");
      return;
    }
    setGalleryText((prev) => (prev.trim().length ? `${prev}\n${result.url}` : result.url as string));
    setMessage("이미지 업로드 완료. 마지막에 설정 저장을 눌러 반영해 주세요.");
  };

  const removeGalleryItem = (target: string) => {
    setGalleryText((prev) =>
      prev
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && line !== target)
        .join("\n")
    );
  };

  const updateLocalized = (setter: (v: (prev: LocalizedText) => LocalizedText) => void, value: string) => {
    setter((prev) => ({ ...prev, [selectedLocale]: value }));
  };
  const updateLocalizedPricingRow = (index: number, key: keyof ManagedPricingTier, value: string) => {
    setPricingTiersByLocale((prev) => {
      const rows = [...(prev[selectedLocale] ?? [])];
      while (rows.length < 3) rows.push({ label: "", price: "", note: "" });
      rows[index] = { ...rows[index], [key]: value };
      return { ...prev, [selectedLocale]: rows };
    });
  };

  return (
    <div className="space-y-5">
      {toast ? (
        <div
          className={`fixed right-5 top-5 z-[260] rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${
            toast.type === "success"
              ? "border-emerald-400/35 bg-emerald-900/70 text-emerald-100"
              : "border-rose-400/35 bg-rose-900/70 text-rose-100"
          }`}
        >
          {toast.text}
        </div>
      ) : null}
      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-white/12 bg-[#081121]/70 p-5 md:p-6"
      >
      <div className="rounded-lg border border-tone-sky/25 bg-tone-sky/10 p-3">
        <p className="text-sm font-semibold text-tone-sky">다국어 편집 (ko / en / ja / zh)</p>
        <p className="mt-1 text-xs text-tone-soft">
          권장 키워드: EN `Incheon Airport Transfer, Private Van, Group Taxi` / JA `空港送迎, ジャンボタクシー, インチョン空港 送迎` / ZH `机场接送, 首尔包车, 韩国旅游包车`
        </p>
        <div className="mt-2 inline-flex rounded-lg border border-white/15 bg-black/30 p-1">
          {localeOptions.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setSelectedLocale(loc)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                selectedLocale === loc ? "bg-brand-gold text-black" : "text-tone-strong"
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">[다국어] SEO 메인 타이틀 ({selectedLocale})</p>
        <input
          value={seoHomeTitleByLocale[selectedLocale]}
          onChange={(e) => updateLocalized(setSeoHomeTitleByLocale, e.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">[다국어] SEO 메인 설명 ({selectedLocale})</p>
        <textarea
          value={seoHomeDescriptionByLocale[selectedLocale]}
          onChange={(e) => updateLocalized(setSeoHomeDescriptionByLocale, e.target.value)}
          className="mt-2 min-h-24 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-tone-strong"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">[다국어] 홈 히어로 타이틀 ({selectedLocale})</p>
        <input
          value={heroTitleByLocale[selectedLocale]}
          onChange={(e) => updateLocalized(setHeroTitleByLocale, e.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">[다국어] 홈 히어로 서브 ({selectedLocale})</p>
        <textarea
          value={heroSubtitleByLocale[selectedLocale]}
          onChange={(e) => updateLocalized(setHeroSubtitleByLocale, e.target.value)}
          className="mt-2 min-h-20 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-tone-strong"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">[다국어] About Me 제목 ({selectedLocale})</p>
        <input
          value={aboutMeTitleByLocale[selectedLocale]}
          onChange={(e) => updateLocalized(setAboutMeTitleByLocale, e.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">[다국어] About Me 설명 ({selectedLocale})</p>
        <textarea
          value={aboutMeDescriptionByLocale[selectedLocale]}
          onChange={(e) => updateLocalized(setAboutMeDescriptionByLocale, e.target.value)}
          className="mt-2 min-h-20 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-tone-strong"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">[다국어] 차량 섹션 제목 ({selectedLocale})</p>
        <input
          value={vehicleSectionTitleByLocale[selectedLocale]}
          onChange={(e) => updateLocalized(setVehicleSectionTitleByLocale, e.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">[다국어] 차량 섹션 설명 ({selectedLocale})</p>
        <textarea
          value={vehicleSectionDescriptionByLocale[selectedLocale]}
          onChange={(e) => updateLocalized(setVehicleSectionDescriptionByLocale, e.target.value)}
          className="mt-2 min-h-20 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-tone-strong"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">[다국어] 요금표 문구 ({selectedLocale})</p>
        <div className="mt-2 space-y-2">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="rounded-md border border-white/15 bg-black/20 p-2">
              <input
                value={pricingTiersByLocale[selectedLocale]?.[idx]?.label ?? ""}
                onChange={(e) => updateLocalizedPricingRow(idx, "label", e.target.value)}
                className="h-9 w-full rounded-md border border-white/20 bg-black/30 px-2 text-xs text-tone-strong"
                placeholder={`항목 ${idx + 1} 제목`}
              />
              <input
                value={pricingTiersByLocale[selectedLocale]?.[idx]?.price ?? ""}
                onChange={(e) => updateLocalizedPricingRow(idx, "price", e.target.value)}
                className="mt-2 h-9 w-full rounded-md border border-white/20 bg-black/30 px-2 text-xs text-tone-strong"
                placeholder={`항목 ${idx + 1} 요금`}
              />
              <textarea
                value={pricingTiersByLocale[selectedLocale]?.[idx]?.note ?? ""}
                onChange={(e) => updateLocalizedPricingRow(idx, "note", e.target.value)}
                className="mt-2 min-h-14 w-full rounded-md border border-white/20 bg-black/30 px-2 py-1.5 text-xs text-tone-strong"
                placeholder={`항목 ${idx + 1} 설명`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <p className="text-sm font-semibold text-tone-sky">전역 설정 (모든 언어 공통)</p>
        <p className="mt-1 text-xs text-tone-soft">
          연락처·SNS·갤러리는 사이트 전역에서 동일하게 사용됩니다. 텍스트 콘텐츠는 위 다국어 탭에서만
          편집하세요.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">헤더 직통 전화번호</p>
        <input
          value={phoneDisplay}
          onChange={(e) => setPhoneDisplay(e.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
          placeholder="010-4135-7621"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">채널 링크 관리</p>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <input
            value={kakaoUrl}
            onChange={(e) => setKakaoUrl(e.target.value)}
            className="h-10 rounded-md border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
            placeholder="카카오톡 비즈니스 URL"
          />
          <input
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            className="h-10 rounded-md border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
            placeholder="인스타그램 URL"
          />
          <input
            value={whatsappUrl}
            onChange={(e) => setWhatsappUrl(e.target.value)}
            className="h-10 rounded-md border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
            placeholder="WhatsApp URL"
          />
          <input
            value={lineUrl}
            onChange={(e) => setLineUrl(e.target.value)}
            className="h-10 rounded-md border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
            placeholder="LINE URL"
          />
          <input
            value={messengerUrl}
            onChange={(e) => setMessengerUrl(e.target.value)}
            className="h-10 rounded-md border border-white/20 bg-black/30 px-3 text-sm text-tone-strong md:col-span-2"
            placeholder="Facebook Messenger URL"
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-tone-strong">갤러리 이미지 URL 목록 (한 줄에 1개)</p>
        <div className="mt-2">
          <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-black/30 px-3 text-xs font-semibold text-tone-strong">
            {uploading ? "업로드 중..." : "이미지 파일 업로드"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => onUploadImage(e.target.files?.[0] ?? null)}
              disabled={uploading}
            />
          </label>
        </div>
        <textarea
          value={galleryText}
          onChange={(e) => setGalleryText(e.target.value)}
          placeholder="/images/gallery/1.jpg"
          className="mt-2 min-h-32 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-tone-strong"
        />
        <p className="mt-2 text-xs text-tone-soft">
          현재 {galleryPreview.length}개 이미지. 예시: <code>/images/home-intro/1.png</code>
        </p>
        {galleryPreview.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {galleryPreview.map((src) => (
              <div key={src} className="rounded-lg border border-white/15 bg-black/30 p-2">
                <div className="relative aspect-video overflow-hidden rounded-md border border-white/10">
                  <Image src={src} alt="갤러리 미리보기" fill unoptimized sizes="220px" className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryItem(src)}
                  className="mt-2 inline-flex h-8 w-full items-center justify-center rounded-md border border-white/20 bg-black/40 text-xs font-semibold text-tone-strong"
                >
                  목록에서 제거
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-metal-bronze/40 bg-metal-bronze-soft px-4 text-sm font-semibold text-tone-strong disabled:opacity-50"
        >
          {saving ? "저장 중..." : "설정 저장"}
        </button>
        {message ? <p className="text-sm text-tone-sky">{message}</p> : null}
      </form>
      <section className="rounded-2xl border border-white/12 bg-[#081121]/70 p-5 md:p-6">
        <h3 className="text-base font-semibold text-tone-strong">최근 변경 이력</h3>
        {changeLogs.length === 0 ? (
          <p className="mt-3 text-sm text-tone-soft">아직 변경 이력이 없습니다.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {changeLogs.map((log) => (
              <li key={log.id} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <p className="text-sm font-medium text-tone-strong">{log.summary}</p>
                <p className="mt-1 text-xs text-tone-soft">
                  {new Date(log.createdAt).toLocaleString("ko-KR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
