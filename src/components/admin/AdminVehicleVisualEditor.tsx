"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminVisualModal } from "@/components/admin/admin-visual-editor-primitives";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";
import { effectiveText } from "@/lib/admin-visual-effective";
import type { FleetVehicleKey } from "@/constants/vehicleFleetImages";
import type { ManagedVehicleMedia } from "@/lib/vehicle-media-types";
import type { VehicleCardContent, VehicleLocale, VehiclePageContent } from "@/lib/vehicle-page-content";

const ORDER: FleetVehicleKey[] = ["staria", "solati", "county"];

type VehicleDefaults = {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDesc: string;
  detailBtn: string;
  bookBtn: string;
  phoneBtn: string;
  tourAvailable: string;
  staria: Record<"badge" | "name" | "seat45" | "seat67" | "luggage" | "f1" | "f2" | "f3" | "f4", string>;
  solati: Record<"badge" | "name" | "capacity" | "luggage" | "f1" | "f2" | "f3" | "f4", string>;
  county: Record<"badge" | "name" | "capacity" | "luggage" | "f1" | "f2" | "f3" | "f4", string>;
};

type Props = {
  initialMedia: ManagedVehicleMedia;
  initialContent: VehiclePageContent;
  defaultsByLocale: Record<VehicleLocale, VehicleDefaults>;
};

const LOCALE_LABELS: Record<VehicleLocale, string> = {
  ko: "🇰🇷 한국어",
  en: "🇺🇸 English",
  ja: "🇯🇵 日本語",
  zh: "🇨🇳 中文",
};

function getLocale(v: Record<VehicleLocale, string>, locale: VehicleLocale) {
  return (v[locale] ?? "").trim();
}

function fieldOrDefault(v: Record<VehicleLocale, string>, locale: VehicleLocale, fallback: string) {
  return getLocale(v, locale) || fallback;
}

export function AdminVehicleVisualEditor({ initialMedia, initialContent, defaultsByLocale }: Props) {
  const router = useRouter();
  const [media, setMedia] = useState(initialMedia);
  const [content, setContent] = useState(initialContent);
  const [locale, setLocale] = useState<VehicleLocale>("ko");
  const [modalLocale, setModalLocale] = useState<VehicleLocale>("ko");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editSection, setEditSection] = useState<null | "hero" | "buttons" | FleetVehicleKey>(null);

  useEffect(() => {
    setMedia(initialMedia);
    setContent(initialContent);
  }, [initialMedia, initialContent]);

  useEffect(() => {
    if (editSection) setModalLocale(locale);
  }, [editSection, locale]);
  const defaults = defaultsByLocale[locale];
  const dm = defaultsByLocale[modalLocale];

  const cards = useMemo(
    () => ({
      staria: {
        badge: fieldOrDefault(content.staria.badge, locale, defaults.staria.badge),
        name: fieldOrDefault(content.staria.name, locale, defaults.staria.name),
        seat45: fieldOrDefault(content.staria.seat45, locale, defaults.staria.seat45),
        seat67: fieldOrDefault(content.staria.seat67, locale, defaults.staria.seat67),
        luggage: fieldOrDefault(content.staria.luggage, locale, defaults.staria.luggage),
        f1: fieldOrDefault(content.staria.f1, locale, defaults.staria.f1),
        f2: fieldOrDefault(content.staria.f2, locale, defaults.staria.f2),
        f3: fieldOrDefault(content.staria.f3, locale, defaults.staria.f3),
        f4: fieldOrDefault(content.staria.f4, locale, defaults.staria.f4),
      },
      solati: {
        badge: fieldOrDefault(content.solati.badge, locale, defaults.solati.badge),
        name: fieldOrDefault(content.solati.name, locale, defaults.solati.name),
        capacity: fieldOrDefault(content.solati.capacity, locale, defaults.solati.capacity),
        luggage: fieldOrDefault(content.solati.luggage, locale, defaults.solati.luggage),
        f1: fieldOrDefault(content.solati.f1, locale, defaults.solati.f1),
        f2: fieldOrDefault(content.solati.f2, locale, defaults.solati.f2),
        f3: fieldOrDefault(content.solati.f3, locale, defaults.solati.f3),
        f4: fieldOrDefault(content.solati.f4, locale, defaults.solati.f4),
      },
      county: {
        badge: fieldOrDefault(content.county.badge, locale, defaults.county.badge),
        name: fieldOrDefault(content.county.name, locale, defaults.county.name),
        capacity: fieldOrDefault(content.county.capacity, locale, defaults.county.capacity),
        luggage: fieldOrDefault(content.county.luggage, locale, defaults.county.luggage),
        f1: fieldOrDefault(content.county.f1, locale, defaults.county.f1),
        f2: fieldOrDefault(content.county.f2, locale, defaults.county.f2),
        f3: fieldOrDefault(content.county.f3, locale, defaults.county.f3),
        f4: fieldOrDefault(content.county.f4, locale, defaults.county.f4),
      },
    }),
    [content, defaults, locale],
  );

  const patchCard = (key: FleetVehicleKey, next: Partial<VehicleCardContent>) =>
    setContent((prev) => ({ ...prev, [key]: { ...prev[key], ...next } }));

  const resetPanel = () => {
    if (!editSection) return;
    const L = modalLocale;
    setContent((prev) => {
      const clr = (lv: Record<VehicleLocale, string>) => ({ ...lv, [L]: "" });
      if (editSection === "hero") {
        return {
          ...prev,
          sectionEyebrow: clr(prev.sectionEyebrow),
          sectionTitle: clr(prev.sectionTitle),
          sectionDesc: clr(prev.sectionDesc),
        };
      }
      if (editSection === "buttons") {
        return {
          ...prev,
          detailBtn: clr(prev.detailBtn),
          bookBtn: clr(prev.bookBtn),
          phoneBtn: clr(prev.phoneBtn),
        };
      }
      const k = editSection;
      const c = prev[k];
      return {
        ...prev,
        [k]: {
          ...c,
          badge: clr(c.badge),
          name: clr(c.name),
          seat45: clr(c.seat45),
          seat67: clr(c.seat67),
          capacity: clr(c.capacity),
          luggage: clr(c.luggage),
          imageAlt: clr(c.imageAlt),
          f1: clr(c.f1),
          f2: clr(c.f2),
          f3: clr(c.f3),
          f4: clr(c.f4),
        },
      };
    });
  };

  const saveAll = async () => {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/vehicle-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media, content }),
    });
    const result = (await res.json()) as { ok: boolean; message?: string };
    setSaving(false);
    if (result.ok) {
      setMessage("저장 완료: /vehicle 페이지에 반영됩니다.");
      router.refresh();
    } else {
      setMessage(result.message ?? "저장 실패");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#081121]/40 p-4 md:p-5">
        <div>
          <p className="text-xs text-tone-soft">편집 언어</p>
          <p className="text-sm font-semibold text-tone-strong">{LOCALE_LABELS[locale]}</p>
        </div>
        <div className="inline-flex gap-1 rounded-xl border border-white/15 bg-black/25 p-1">
          {(Object.keys(LOCALE_LABELS) as VehicleLocale[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                locale === l ? "bg-brand-gold text-black shadow" : "text-tone-strong hover:text-brand-gold"
              }`}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-tone-strong">상단 안내 문구</h2>
          </div>
          <button onClick={() => setEditSection("hero")} className="rounded-lg border border-brand-gold/35 px-3 py-1.5 text-xs font-semibold text-brand-gold">
            섹션 문구 수정
          </button>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-brand-gold/90">
          {fieldOrDefault(content.sectionEyebrow, locale, defaults.sectionEyebrow)}
        </p>
        <p className="mt-2 text-2xl font-bold text-brand-gold">{fieldOrDefault(content.sectionTitle, locale, defaults.sectionTitle)}</p>
        <p className="mt-2 text-sm text-tone-body">{fieldOrDefault(content.sectionDesc, locale, defaults.sectionDesc)}</p>
      </div>

      <div className="space-y-8">
        {ORDER.map((key) => (
          <article key={key} className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(12,16,24,0.92),rgba(8,12,20,0.98))]">
            <div className="flex flex-col lg:flex-row">
              <div className="relative aspect-[16/10] w-full lg:w-[44%]">
                <Image src={media.main[key]} alt={cards[key].name} fill className="object-cover" />
                <button
                  onClick={() => setEditSection(key)}
                  className="absolute right-3 top-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-semibold text-white"
                >
                  이미지 수정
                </button>
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-tone-sky/90">{cards[key].badge}</p>
                    <h3 className="mt-2 text-2xl font-bold text-tone-strong">{cards[key].name}</h3>
                    <p className="mt-2 inline-flex rounded-full border border-tone-sky/35 bg-tone-sky/10 px-3 py-1 text-xs font-semibold text-tone-sky">
                      {fieldOrDefault(content.tourAvailable, locale, defaults.tourAvailable)}
                    </p>
                  </div>
                  <button onClick={() => setEditSection(key)} className="rounded-lg border border-brand-gold/35 px-3 py-1.5 text-xs font-semibold text-brand-gold">
                    텍스트 수정
                  </button>
                </div>
                <div className="mt-4 text-sm text-tone-body">
                  {key === "staria" ? (
                    <p>{cards.staria.seat45} · {cards.staria.seat67} · {cards.staria.luggage}</p>
                  ) : (
                    <p>{cards[key].capacity} · {cards[key].luggage}</p>
                  )}
                </div>
                <ul className="mt-4 grid gap-2 text-sm text-tone-body sm:grid-cols-2">
                  {[cards[key].f1, cards[key].f2, cards[key].f3, cards[key].f4].map((v, idx) => (
                    <li key={idx}>• {v}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => setEditSection("buttons")} className="rounded-xl border border-tone-sky/40 px-4 py-2 text-sm font-semibold text-tone-sky">
                    {fieldOrDefault(content.detailBtn, locale, defaults.detailBtn)}
                  </button>
                  <button onClick={() => setEditSection("buttons")} className="rounded-xl bg-[#5fb7ff] px-4 py-2 text-sm font-semibold text-[#041325]">
                    {fieldOrDefault(content.bookBtn, locale, defaults.bookBtn)}
                  </button>
                  <button onClick={() => setEditSection("buttons")} className="rounded-xl border border-brand-gold/45 bg-brand-gold px-4 py-2 text-sm font-semibold text-black">
                    {fieldOrDefault(content.phoneBtn, locale, defaults.phoneBtn)}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <AdminVisualModal
        open={editSection !== null}
        title={
          editSection === "hero"
            ? "차량 · 섹션 문구"
            : editSection === "buttons"
              ? "차량 · 버튼 문구"
              : editSection
                ? `차량 · ${editSection.toUpperCase()} 카드`
                : ""
        }
        onClose={() => setEditSection(null)}
        editLocale={modalLocale}
        onEditLocale={(l) => setModalLocale(l as VehicleLocale)}
        onSave={() => void saveAll()}
        saving={saving}
        onReset={resetPanel}
      >
        {editSection === "hero" ? (
          <>
            <input
              className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
              value={effectiveText(content.sectionEyebrow[modalLocale], dm.sectionEyebrow)}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  sectionEyebrow: { ...p.sectionEyebrow, [modalLocale]: e.target.value },
                }))
              }
            />
            <input
              className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
              value={effectiveText(content.sectionTitle[modalLocale], dm.sectionTitle)}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  sectionTitle: { ...p.sectionTitle, [modalLocale]: e.target.value },
                }))
              }
            />
            <textarea
              className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
              rows={3}
              value={effectiveText(content.sectionDesc[modalLocale], dm.sectionDesc)}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  sectionDesc: { ...p.sectionDesc, [modalLocale]: e.target.value },
                }))
              }
            />
          </>
        ) : null}

        {editSection === "buttons" ? (
          <>
            <input
              className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
              value={effectiveText(content.detailBtn[modalLocale], dm.detailBtn)}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  detailBtn: { ...p.detailBtn, [modalLocale]: e.target.value },
                }))
              }
            />
            <input
              className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
              value={effectiveText(content.bookBtn[modalLocale], dm.bookBtn)}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  bookBtn: { ...p.bookBtn, [modalLocale]: e.target.value },
                }))
              }
            />
            <input
              className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
              value={effectiveText(content.phoneBtn[modalLocale], dm.phoneBtn)}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  phoneBtn: { ...p.phoneBtn, [modalLocale]: e.target.value },
                }))
              }
            />
          </>
        ) : null}

        {editSection && editSection !== "hero" && editSection !== "buttons" ? (
          <>
            <AdminImageUploader
              section="vehicles"
              purpose={`${editSection}-main`}
              label="메인 외관 이미지"
              value={media.main[editSection]}
              onChange={(nextUrl) => setMedia((p) => ({ ...p, main: { ...p.main, [editSection]: nextUrl } }))}
            />
            <input
              className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
              value={effectiveText(content[editSection].badge[modalLocale], dm[editSection].badge)}
              onChange={(e) =>
                patchCard(editSection, {
                  badge: { ...content[editSection].badge, [modalLocale]: e.target.value },
                })
              }
            />
            <input
              className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
              value={effectiveText(content[editSection].name[modalLocale], dm[editSection].name)}
              onChange={(e) =>
                patchCard(editSection, {
                  name: { ...content[editSection].name, [modalLocale]: e.target.value },
                })
              }
            />
            <input
              className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
              value={effectiveText(content[editSection].luggage[modalLocale], dm[editSection].luggage)}
              onChange={(e) =>
                patchCard(editSection, {
                  luggage: { ...content[editSection].luggage, [modalLocale]: e.target.value },
                })
              }
            />
            {editSection === "staria" ? (
              <>
                <input
                  className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
                  value={effectiveText(content.staria.seat45[modalLocale], dm.staria.seat45)}
                  onChange={(e) =>
                    patchCard("staria", {
                      seat45: { ...content.staria.seat45, [modalLocale]: e.target.value },
                    })
                  }
                />
                <input
                  className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
                  value={effectiveText(content.staria.seat67[modalLocale], dm.staria.seat67)}
                  onChange={(e) =>
                    patchCard("staria", {
                      seat67: { ...content.staria.seat67, [modalLocale]: e.target.value },
                    })
                  }
                />
              </>
            ) : (
              <input
                className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
                value={effectiveText(content[editSection].capacity[modalLocale], dm[editSection].capacity)}
                onChange={(e) =>
                  patchCard(editSection, {
                    capacity: { ...content[editSection].capacity, [modalLocale]: e.target.value },
                  })
                }
              />
            )}
            {(["f1", "f2", "f3", "f4"] as const).map((f) => (
              <input
                key={f}
                className="h-10 w-full rounded-lg border border-white/20 bg-black/40 px-3 text-sm"
                value={effectiveText(content[editSection][f][modalLocale], dm[editSection][f])}
                onChange={(e) =>
                  patchCard(editSection, {
                    [f]: { ...content[editSection][f], [modalLocale]: e.target.value },
                  } as Partial<VehicleCardContent>)
                }
              />
            ))}
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx}>
                  <AdminImageUploader
                    section="vehicles"
                    purpose={`${editSection}-interior-${idx + 1}`}
                    label={`실내 이미지 ${idx + 1}`}
                    value={media.interior[editSection][idx] ?? ""}
                    onChange={(nextUrl) =>
                      setMedia((p) => {
                        const next = [...p.interior[editSection]];
                        next[idx] = nextUrl.trim() ? nextUrl : null;
                        return { ...p, interior: { ...p.interior, [editSection]: next } };
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </AdminVisualModal>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-metal-bronze/25 bg-[#0a1522] px-4 py-3">
        <button
          type="button"
          onClick={() => void saveAll()}
          disabled={saving}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-brand-gold to-[#b8892a] px-5 text-sm font-bold text-black disabled:opacity-60"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
        {message ? <p className="text-sm text-tone-sky">{message}</p> : null}
      </div>
    </section>
  );
}
