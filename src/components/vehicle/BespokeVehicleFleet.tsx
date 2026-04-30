"use client";

import Image from "next/image";
import { Check, Luggage, Phone, Users, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { SITE_PHONE_TEL } from "@/lib/site";
import { cn } from "@/lib/utils";

const accent = "text-tone-sky";
const accentSoft = "text-tone-sky/90";

const FLEET_IMAGES = {
  staria:
    "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=1400&q=82",
  solati:
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1400&q=82",
  county:
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=82",
} as const;

const ROW_KEYS = ["staria", "solati", "county"] as const;
export type FleetVehicleKey = (typeof ROW_KEYS)[number];

const GALLERY_SLOT_COUNT = 6;

/** 상세 슬롯별 이미지 URL — null 이면 플레이스홀더. 추후 URL만 채우면 됩니다. */
const DETAIL_GALLERY_SRC: Record<FleetVehicleKey, (string | null)[]> = {
  staria: [
    FLEET_IMAGES.staria,
    null,
    null,
    null,
    null,
    null,
  ],
  solati: [FLEET_IMAGES.solati, null, null, null, null, null],
  county: [FLEET_IMAGES.county, null, null, null, null, null],
};

type FleetRowProps = {
  vkey: FleetVehicleKey;
  onOpenDetail: (key: FleetVehicleKey) => void;
};

function FleetRow({ vkey, onOpenDetail }: FleetRowProps) {
  const t = useTranslations("VehicleFleet");
  const img = FLEET_IMAGES[vkey];

  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(12,16,24,0.92),rgba(8,12,20,0.98))] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <div className="relative aspect-[16/10] w-full shrink-0 lg:aspect-auto lg:min-h-[280px] lg:w-[min(44%,480px)]">
          <Image
            src={img}
            alt={t(`${vkey}.imageAlt`)}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 480px"
            priority={vkey === "staria"}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent lg:from-black/40" />
          <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-lg border border-white/15 bg-black/45 px-4 py-2 backdrop-blur-sm">
            <span
              className={`font-semibold uppercase tracking-[0.28em] ${accent}`}
              style={{
                textShadow:
                  "0 0 18px rgba(143,200,255,0.85), 0 0 42px rgba(143,200,255,0.35)",
              }}
            >
              Kkebi
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-8 p-7 md:p-9 lg:flex-row lg:items-center lg:gap-10 lg:p-10">
          <div className="min-w-0 flex-1 space-y-5">
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${accentSoft}`}>
                {t(`${vkey}.badge`)}
              </p>
              <h3 className="mt-2 font-sans text-2xl font-bold tracking-[-0.02em] text-tone-strong md:text-3xl">
                {t(`${vkey}.name`)}
              </h3>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-tone-body md:text-base">
              {vkey === "staria" ? (
                <>
                  <span className="inline-flex items-center gap-2">
                    <Users className={`h-4 w-4 shrink-0 ${accent}`} aria-hidden />
                    <span className="font-medium text-tone-strong">{t("staria.seat45")}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users className={`h-4 w-4 shrink-0 ${accent}`} aria-hidden />
                    <span className="font-medium text-tone-strong">{t("staria.seat67")}</span>
                  </span>
                  <span className="inline-flex w-full items-center gap-2 sm:w-auto">
                    <Luggage className={`h-4 w-4 shrink-0 ${accent}`} aria-hidden />
                    <span>{t("staria.luggage")}</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-2">
                    <Users className={`h-4 w-4 shrink-0 ${accent}`} aria-hidden />
                    <span className="font-medium text-tone-strong">{t(`${vkey}.capacity`)}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Luggage className={`h-4 w-4 shrink-0 ${accent}`} aria-hidden />
                    <span>{t(`${vkey}.luggage`)}</span>
                  </span>
                </>
              )}
            </div>

            <ul className="grid gap-2.5 sm:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <li
                  key={n}
                  className="flex items-start gap-2.5 text-sm leading-snug text-tone-body md:text-[15px]"
                >
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${accent}`}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <span>{t(`${vkey}.f${n}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[12.5rem]">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className={cn(
                "w-full border-tone-sky/40 font-semibold text-tone-sky hover:border-tone-sky/60 hover:bg-white/[0.06]",
              )}
              onClick={() => onOpenDetail(vkey)}
            >
              {t("detailBtn")}
            </Button>
            <Link
              href="/booking"
              className={cn(
                "inline-flex h-12 w-full items-center justify-center rounded-xl px-8 text-base font-semibold transition-[filter]",
                "bg-brand-gold text-accent-foreground shadow-sm hover:brightness-110 active:brightness-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              {t("bookBtn")}
            </Link>
            <a
              href={SITE_PHONE_TEL}
              className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/60 px-8 text-base font-semibold text-emerald-100",
                "bg-emerald-600/90 transition-colors hover:bg-emerald-500 hover:border-emerald-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              {t("phoneBtn")}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function VehicleDetailModal({
  open,
  vehicleKey,
  onClose,
}: {
  open: boolean;
  vehicleKey: FleetVehicleKey | null;
  onClose: () => void;
}) {
  const t = useTranslations("VehicleFleet");
  const titleId = useId();
  const descId = useId();
  const [previewSlot, setPreviewSlot] = useState<number | null>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (previewSlot !== null) {
        setPreviewSlot(null);
        return;
      }
      onClose();
    },
    [previewSlot, onClose],
  );

  useEffect(() => {
    if (!open) {
      setPreviewSlot(null);
      return;
    }
    document.addEventListener("keydown", handleEscape);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = prev;
    };
  }, [open, handleEscape]);

  if (!open || !vehicleKey) return null;

  const slots = DETAIL_GALLERY_SRC[vehicleKey];
  const previewSrc = previewSlot !== null ? slots[previewSlot] ?? null : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label={t("modalClose")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 flex max-h-[min(92vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,#0a1018_0%,#06090f_100%)] shadow-[0_32px_80px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-6 py-5 md:px-8 md:py-6">
          <div className="min-w-0">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${accentSoft}`}>
              {t(`${vehicleKey}.badge`)}
            </p>
            <h2 id={titleId} className="mt-2 font-sans text-2xl font-bold text-tone-strong md:text-3xl">
              {t(`${vehicleKey}.name`)}
            </h2>
            <p id={descId} className="mt-3 text-sm leading-relaxed text-tone-body md:text-base">
              {t("galleryNote")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2.5 text-tone-soft transition-colors hover:bg-white/10 hover:text-tone-strong"
            aria-label={t("modalClose")}
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-tone-sky/90">
            {t("galleryHeading")}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {Array.from({ length: GALLERY_SLOT_COUNT }).map((_, i) => {
              const src = slots[i] ?? null;
              const slotAlt = `${t(`${vehicleKey}.name`)} · ${t("gallerySlotLabel")} ${i + 1}`;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewSlot(i)}
                  className={cn(
                    "group relative aspect-[4/3] overflow-hidden rounded-2xl border border-dashed border-white/18 bg-white/[0.03] text-center transition-colors hover:border-tone-sky/40 hover:bg-white/[0.06]",
                    src && "border-solid border-white/12 p-0",
                  )}
                >
                  {src ? (
                    <Image
                      src={src}
                      alt={slotAlt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 45vw, 200px"
                    />
                  ) : (
                    <span className="flex h-full flex-col items-center justify-center px-3">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-tone-soft">
                        {t("gallerySlotLabel")}
                      </span>
                      <span className="mt-1 font-numeric text-lg font-semibold tabular-nums text-tone-sky/90">
                        {i + 1}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-white/10 px-6 py-5 md:flex-row md:justify-end md:px-8 md:py-6">
          <Link
            href="/booking"
            onClick={onClose}
            className={cn(
              "inline-flex h-12 min-w-0 items-center justify-center rounded-xl px-8 text-base font-semibold md:min-w-[11rem]",
              "bg-brand-gold text-accent-foreground shadow-sm hover:brightness-110 active:brightness-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            {t("bookBtn")}
          </Link>
          <a
            href={SITE_PHONE_TEL}
            onClick={onClose}
            className={cn(
              "inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-xl border border-emerald-400/60 px-8 text-base font-semibold text-emerald-100 md:min-w-[11rem]",
              "bg-emerald-600/90 transition-colors hover:bg-emerald-500 hover:border-emerald-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            {t("phoneBtn")}
          </a>
        </footer>
      </div>

      {previewSlot !== null && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            aria-label={t("modalClose")}
            onClick={() => setPreviewSlot(null)}
          />
          <div
            className="relative z-10 flex max-h-[min(90vh,920px)] w-full max-w-5xl flex-col gap-3"
            role="dialog"
            aria-modal="true"
            aria-label={t("galleryHeading")}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-2xl sm:aspect-video">
              {previewSrc ? (
                <Image
                  src={previewSrc}
                  alt={`${t(`${vehicleKey}.name`)} · ${t("galleryHeading")}`}
                  fill
                  className="object-contain bg-black/30"
                  sizes="100vw"
                  priority
                />
              ) : (
                <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-6">
                  <span className="text-sm font-medium uppercase tracking-wide text-tone-soft">
                    {t("gallerySlotLabel")} · {previewSlot + 1}
                  </span>
                  <span className="mt-2 text-center text-sm text-tone-body">{t("galleryNote")}</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPreviewSlot(null)}
              className="self-end rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-tone-strong hover:bg-white/12"
            >
              {t("modalClose")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function BespokeVehicleFleet() {
  const t = useTranslations("VehicleFleet");
  const [detailKey, setDetailKey] = useState<FleetVehicleKey | null>(null);

  return (
    <>
      <section
        id="vehicle-fleet"
        className="scroll-mt-24 border-b border-border/45 bg-[radial-gradient(ellipse_at_50%_0%,rgba(143,200,255,0.06),transparent_55%)] py-16 md:py-24"
        aria-labelledby="fleet-heading"
      >
        <div className="mx-auto max-w-content px-4 md:px-6">
          <header className="mb-12 max-w-3xl md:mb-16">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.26em] ${accentSoft}`}>
              {t("sectionEyebrow")}
            </p>
            <h2
              id="fleet-heading"
              className="mt-3 font-sans text-3xl font-bold tracking-[-0.02em] text-tone-strong md:text-4xl"
            >
              {t("sectionTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-tone-body md:text-lg">{t("sectionDesc")}</p>
          </header>

          <div className="flex flex-col gap-10 md:gap-12">
            {ROW_KEYS.map((key) => (
              <FleetRow key={key} vkey={key} onOpenDetail={setDetailKey} />
            ))}
          </div>
        </div>
      </section>

      <VehicleDetailModal open={detailKey !== null} vehicleKey={detailKey} onClose={() => setDetailKey(null)} />
    </>
  );
}
