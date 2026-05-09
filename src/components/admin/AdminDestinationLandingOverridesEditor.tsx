"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";
import { effectiveText } from "@/lib/admin-visual-effective";
import {
  getCopyForLocale,
  getLandingPageBySlug,
} from "../../../data/landing-pages";
import type { DestinationContentOverride } from "@/lib/destination-admin-types";
import type { LocalizedText } from "@/lib/site-settings-store";
import { pickOverrideText } from "@/lib/destination-admin-types";
import { normalizeSiteSettingsForPersist } from "@/lib/normalize-site-settings-persist";
import type { LocaleKey, SiteSettings } from "@/lib/site-settings-store";

type Props = {
  initialSettings: SiteSettings;
  destinationSlugs: string[];
  messagesByLocale: Record<LocaleKey, Record<string, unknown>>;
  editLocale: LocaleKey;
};

const LOC: LocaleKey[] = ["ko", "en", "ja", "zh"];

function emptyLt() {
  return { ko: "", en: "", ja: "", zh: "" };
}

export function AdminDestinationLandingOverridesEditor({
  initialSettings,
  destinationSlugs,
  messagesByLocale,
  editLocale,
}: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<SiteSettings>(initialSettings);
  const [slug, setSlug] = useState(destinationSlugs[0] ?? "");
  const [locale, setLocale] = useState<LocaleKey>(editLocale);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setDraft(initialSettings);
  }, [initialSettings]);

  const baseCopy = useMemo(() => {
    const page = slug ? getLandingPageBySlug(slug) : undefined;
    return page ? getCopyForLocale(page, locale) : null;
  }, [slug, locale]);

  const ov = slug ? draft.destinationContentOverrides[slug] : undefined;

  const patchOv = (patch: Partial<DestinationContentOverride>) => {
    if (!slug) return;
    setDraft((d) => ({
      ...d,
      destinationContentOverrides: {
        ...d.destinationContentOverrides,
        [slug]: { ...d.destinationContentOverrides[slug], ...patch },
      },
    }));
  };

  const patchLt = (
    key: keyof Pick<
      DestinationContentOverride,
      | "h1"
      | "lede"
      | "vehicleRecommendBlurb"
      | "travelTraitsLine"
      | "sectionServiceBody"
      | "sectionCoverageBody"
      | "sectionWhyBody"
      | "primaryCtaLabel"
      | "secondaryCtaLabel"
      | "pricingIntro"
      | "heroImageAlt"
    >,
    value: string,
  ) => {
    const cur = (ov?.[key] as LocalizedText | undefined) ?? emptyLt();
    patchOv({ [key]: { ...cur, [locale]: value } } as Partial<DestinationContentOverride>);
  };

  const save = async () => {
    setSaving(true);
    setToast("");
    try {
      const payload = normalizeSiteSettingsForPersist(draft, messagesByLocale);
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (data.ok) {
        setToast("저장되었습니다.");
        router.refresh();
      } else {
        setToast(data.message ?? "저장 실패");
      }
    } catch {
      setToast("저장 실패");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-tone-soft">랜딩 slug</label>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 h-10 rounded-lg border border-white/20 bg-black/30 px-3 font-mono text-xs"
          >
            {destinationSlugs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-tone-soft">편집 언어</label>
          <div className="mt-1 inline-flex gap-1 rounded-lg border border-white/15 bg-black/20 p-1">
            {LOC.map((loc) => (
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
      </div>

      {baseCopy ? (
        <div className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
          <p className="text-xs text-tone-soft">
            비워 두면 공개 페이지에는 데이터 파일 기본값이 그대로 적용됩니다. 저장 후 공개 탭에서 새로고침해 확인하세요.
          </p>

          <label className="block text-xs font-semibold text-tone-strong">히어로 제목 (h1)</label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            value={effectiveText(pickOverrideText(ov?.h1, locale), baseCopy.h1)}
            onChange={(e) => patchLt("h1", e.target.value)}
          />

          <label className="block text-xs font-semibold text-tone-strong">히어로 설명 (lede)</label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            value={effectiveText(pickOverrideText(ov?.lede, locale), baseCopy.lede)}
            onChange={(e) => patchLt("lede", e.target.value)}
          />

          <label className="block text-xs font-semibold text-tone-strong">차량 추천 문구</label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            value={effectiveText(
              pickOverrideText(ov?.vehicleRecommendBlurb, locale),
              baseCopy.vehicleRecommendBlurb ?? "",
            )}
            onChange={(e) => patchLt("vehicleRecommendBlurb", e.target.value)}
          />

          <label className="block text-xs font-semibold text-tone-strong">이동 특성</label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            value={effectiveText(
              pickOverrideText(ov?.travelTraitsLine, locale),
              baseCopy.travelTraitsLine ?? "",
            )}
            onChange={(e) => patchLt("travelTraitsLine", e.target.value)}
          />

          <label className="block text-xs font-semibold text-tone-strong">본문 섹션 1·2·3</label>
          <textarea
            rows={3}
            placeholder={baseCopy.sections[0]?.body}
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            value={effectiveText(
              pickOverrideText(ov?.sectionServiceBody, locale),
              baseCopy.sections[0]?.body ?? "",
            )}
            onChange={(e) => patchLt("sectionServiceBody", e.target.value)}
          />
          <textarea
            rows={3}
            placeholder={baseCopy.sections[1]?.body}
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            value={effectiveText(
              pickOverrideText(ov?.sectionCoverageBody, locale),
              baseCopy.sections[1]?.body ?? "",
            )}
            onChange={(e) => patchLt("sectionCoverageBody", e.target.value)}
          />
          <textarea
            rows={3}
            placeholder={baseCopy.sections[2]?.body}
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            value={effectiveText(
              pickOverrideText(ov?.sectionWhyBody, locale),
              baseCopy.sections[2]?.body ?? "",
            )}
            onChange={(e) => patchLt("sectionWhyBody", e.target.value)}
          />

          <label className="block text-xs font-semibold text-tone-strong">FAQ (최대 3쌍, 비우면 기본)</label>
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-white/10 p-3">
              <input
                className="mb-2 w-full rounded border border-white/20 bg-black/40 px-2 py-1 text-xs"
                placeholder={baseCopy.faq[i]?.q}
                value={effectiveText(pickOverrideText(ov?.faq?.[i]?.q, locale), baseCopy.faq[i]?.q ?? "")}
                onChange={(e) => {
                  const faq = [...(ov?.faq ?? [])];
                  while (faq.length <= i) faq.push({ q: emptyLt(), a: emptyLt() });
                  faq[i] = { ...faq[i], q: { ...faq[i].q, [locale]: e.target.value } };
                  patchOv({ faq });
                }}
              />
              <textarea
                rows={2}
                className="w-full rounded border border-white/20 bg-black/40 px-2 py-1 text-xs"
                placeholder={baseCopy.faq[i]?.a}
                value={effectiveText(pickOverrideText(ov?.faq?.[i]?.a, locale), baseCopy.faq[i]?.a ?? "")}
                onChange={(e) => {
                  const faq = [...(ov?.faq ?? [])];
                  while (faq.length <= i) faq.push({ q: emptyLt(), a: emptyLt() });
                  faq[i] = { ...faq[i], a: { ...faq[i].a, [locale]: e.target.value } };
                  patchOv({ faq });
                }}
              />
            </div>
          ))}

          <label className="block text-xs font-semibold text-tone-strong">CTA 라벨</label>
          <input
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            value={effectiveText(pickOverrideText(ov?.primaryCtaLabel, locale), baseCopy.primaryCtaLabel)}
            onChange={(e) => patchLt("primaryCtaLabel", e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            value={effectiveText(pickOverrideText(ov?.secondaryCtaLabel, locale), baseCopy.secondaryCtaLabel)}
            onChange={(e) => patchLt("secondaryCtaLabel", e.target.value)}
          />

          <label className="block text-xs font-semibold text-tone-strong">요금 블록 도입문</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2"
            value={effectiveText(pickOverrideText(ov?.pricingIntro, locale), baseCopy.pricingIntro)}
            onChange={(e) => patchLt("pricingIntro", e.target.value)}
          />

          <AdminImageUploader
            section="destination-hero"
            purpose={slug}
            label="히어로 이미지 (선택)"
            value={ov?.heroImageSrc ?? ""}
            onChange={(next) => patchOv({ heroImageSrc: next })}
          />
          <input
            className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-xs"
            placeholder={baseCopy.hero.alt}
            value={effectiveText(pickOverrideText(ov?.heroImageAlt, locale), baseCopy.hero.alt)}
            onChange={(e) => patchLt("heroImageAlt", e.target.value)}
          />

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="rounded-lg bg-gradient-to-r from-brand-gold to-[#b8892a] px-5 py-2 text-sm font-bold text-black disabled:opacity-50"
            >
              {saving ? "저장 중…" : "랜딩 오버라이드 저장"}
            </button>
            <span className="text-xs text-tone-soft">{toast}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-tone-soft">slug를 선택하세요.</p>
      )}
    </section>
  );
}
