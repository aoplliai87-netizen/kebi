"use client";

import { useState } from "react";
import type { FleetVehicleKey } from "@/constants/vehicleFleetImages";
import type { ManagedVehicleMedia } from "@/lib/vehicle-media-types";

const VEHICLE_KEYS: FleetVehicleKey[] = ["staria", "solati", "county"];

const LABELS: Record<FleetVehicleKey, string> = {
  staria: "Staria",
  solati: "Solati",
  county: "County",
};

type Props = {
  initialMedia: ManagedVehicleMedia;
};

export function AdminVehicleMediaEditor({ initialMedia }: Props) {
  const [media, setMedia] = useState<ManagedVehicleMedia>(initialMedia);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateMain = (key: FleetVehicleKey, value: string) => {
    setMedia((prev) => ({ ...prev, main: { ...prev.main, [key]: value } }));
  };

  const updateInterior = (key: FleetVehicleKey, idx: number, value: string) => {
    setMedia((prev) => {
      const nextSlots = [...prev.interior[key]];
      nextSlots[idx] = value.trim() ? value : null;
      return { ...prev, interior: { ...prev.interior, [key]: nextSlots } };
    });
  };

  const onSave = async () => {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/vehicle-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media }),
    });
    const result = (await res.json()) as { ok: boolean; message?: string };
    setSaving(false);
    setMessage(result.ok ? "차량 이미지 저장 완료" : result.message ?? "저장 실패");
  };

  const onReload = async () => {
    const res = await fetch("/api/admin/vehicle-media", { cache: "no-store" });
    const result = (await res.json()) as { ok?: boolean; media?: ManagedVehicleMedia };
    if (result.ok && result.media) {
      setMedia(result.media);
      setMessage("저장된 최신 값으로 다시 불러왔습니다.");
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
      <h2 className="text-base font-bold text-tone-sky">🚐 차량 이미지 관리 (외관 + 실내)</h2>
      <p className="text-xs leading-relaxed text-tone-soft">
        URL 입력만으로 즉시 반영됩니다. 로컬 파일은 <code>/public/images/vehicles/...</code> 형태로 입력하세요.
      </p>

      {VEHICLE_KEYS.map((key) => (
        <section key={key} className="space-y-3 rounded-xl border border-white/12 bg-black/20 p-4">
          <h3 className="text-sm font-semibold text-tone-strong">{LABELS[key]}</h3>

          <div>
            <p className="mb-1 text-xs text-tone-soft">외관 메인 이미지</p>
            <input
              value={media.main[key]}
              onChange={(e) => updateMain(key, e.target.value)}
              className="h-10 w-full rounded-md border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
              placeholder="/images/vehicles/staria-hero.png"
            />
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={`${key}-${idx}`}>
                <p className="mb-1 text-xs text-tone-soft">실내 사진 {idx + 1}</p>
                <input
                  value={media.interior[key][idx] ?? ""}
                  onChange={(e) => updateInterior(key, idx, e.target.value)}
                  className="h-10 w-full rounded-md border border-white/20 bg-black/30 px-3 text-sm text-tone-strong"
                  placeholder={`/images/vehicles/interiors/${key}-${String(idx + 1).padStart(2, "0")}.jpg`}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3 rounded-xl border border-metal-bronze/25 bg-[#0a1522] px-4 py-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-brand-gold to-[#b8892a] px-5 text-sm font-bold text-black disabled:opacity-60"
        >
          {saving ? "저장 중..." : "차량 이미지 저장"}
        </button>
        <button
          type="button"
          onClick={() => void onReload()}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-white/20 bg-black/30 px-4 text-sm font-semibold text-tone-strong"
        >
          저장값 다시 불러오기
        </button>
        {message ? <p className="text-sm text-tone-sky">{message}</p> : null}
      </div>
    </div>
  );
}
