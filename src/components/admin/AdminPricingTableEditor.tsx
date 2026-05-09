"use client";

import { useMemo, useState } from "react";
import type {
  ManagedPricingEntry,
  ManagedPricingGroup,
  ManagedPricingRegion,
  ManagedPricingRow,
} from "@/lib/pricing-table-types";
import { isManagedPricingGroup } from "@/lib/pricing-table-types";

type Props = {
  initialRegions: ManagedPricingRegion[];
  /** 상위 비주얼 에디터와 표 데이터 동기화 */
  regions?: ManagedPricingRegion[];
  onRegionsChange?: (next: ManagedPricingRegion[]) => void;
  /** true면 하단 저장·불러오기 바 숨김 (부모에서 저장) */
  hidePersistenceBar?: boolean;
};

function emptyRow(): ManagedPricingRow {
  return { name: "", nameEn: "", gimpo: 0, incheon: 0 };
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export function AdminPricingTableEditor({
  initialRegions,
  regions: controlledRegions,
  onRegionsChange,
  hidePersistenceBar = false,
}: Props) {
  const [internalRegions, setInternalRegions] = useState<ManagedPricingRegion[]>(initialRegions);
  const controlled = controlledRegions !== undefined && onRegionsChange !== undefined;
  const regions = controlled ? controlledRegions : internalRegions;

  const patchRegions = (fn: (prev: ManagedPricingRegion[]) => ManagedPricingRegion[]) => {
    if (controlled) {
      onRegionsChange!(fn(controlledRegions));
    } else {
      setInternalRegions(fn);
    }
  };

  const [activeRegionId, setActiveRegionId] = useState<string>(initialRegions[0]?.id ?? "seoul");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const activeRegion = useMemo(
    () => regions.find((r) => r.id === activeRegionId) ?? regions[0],
    [regions, activeRegionId],
  );

  const updateRegion = (regionId: string, updater: (region: ManagedPricingRegion) => ManagedPricingRegion) => {
    patchRegions((prev) => prev.map((region) => (region.id === regionId ? updater(region) : region)));
  };

  const updateEntry = (entryIndex: number, updater: (entry: ManagedPricingEntry) => ManagedPricingEntry) => {
    if (!activeRegion) return;
    updateRegion(activeRegion.id, (region) => {
      const rows = [...region.rows];
      rows[entryIndex] = updater(rows[entryIndex]);
      return { ...region, rows };
    });
  };

  const removeEntry = (entryIndex: number) => {
    if (!activeRegion) return;
    updateRegion(activeRegion.id, (region) => ({
      ...region,
      rows: region.rows.filter((_, i) => i !== entryIndex),
    }));
  };

  const onSave = async () => {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/pricing-table", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regions }),
    });
    const result = (await res.json()) as { ok: boolean; message?: string };
    setSaving(false);
    setMessage(result.ok ? "요금안내 상세표 저장 완료" : result.message ?? "저장 실패");
  };

  const onReset = async () => {
    const res = await fetch("/api/admin/pricing-table", { cache: "no-store" });
    const result = (await res.json()) as { ok?: boolean; regions?: ManagedPricingRegion[] };
    if (result.ok && Array.isArray(result.regions)) {
      patchRegions(() => result.regions!);
      setActiveRegionId(result.regions[0]?.id ?? "seoul");
      setMessage("저장된 최신 값으로 다시 불러왔습니다.");
    }
  };

  if (!activeRegion) {
    return <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-tone-soft">편집할 지역 데이터가 없습니다.</div>;
  }

  return (
    <div className="space-y-5 rounded-2xl border border-white/10 bg-[#081121]/70 p-5 md:p-6">
      <h2 className="text-base font-bold text-tone-sky">💹 요금안내 상세표 편집</h2>
      <p className="text-xs leading-relaxed text-tone-soft">
        이 화면에서 수정한 내용은 <code>/pricing</code> 페이지에 즉시 반영됩니다. (SEO 구조는 변경되지 않음)
      </p>

      <div className="grid gap-2 sm:grid-cols-3">
        {regions.map((region) => (
          <button
            key={region.id}
            type="button"
            onClick={() => setActiveRegionId(region.id)}
            className={`rounded-lg border px-3 py-2 text-left text-sm ${
              region.id === activeRegion.id
                ? "border-brand-gold/60 bg-brand-gold/15 text-brand-gold"
                : "border-white/12 bg-black/20 text-tone-strong"
            }`}
          >
            <p className="font-semibold">{region.name}</p>
            <p className="text-xs text-tone-soft">{region.nameEn}</p>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
        <p className="text-sm font-semibold text-tone-strong">현재 편집 중: {activeRegion.name}</p>
        <p className="mt-1 text-xs text-tone-soft">행(지역) 추가/삭제와 김포·인천 금액을 직접 수정할 수 있습니다.</p>
      </div>

      <div className="space-y-3">
        {activeRegion.rows.map((entry, idx) => (
          <div key={`${activeRegion.id}-${idx}`} className="rounded-xl border border-white/12 bg-black/25 p-3">
            {isManagedPricingGroup(entry) ? (
              <div className="space-y-3">
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={entry.name}
                    onChange={(e) => updateEntry(idx, (prev) => ({ ...(prev as ManagedPricingGroup), name: e.target.value }))}
                    className="h-10 rounded-md border border-white/20 bg-black/30 px-2 text-sm text-tone-strong"
                    placeholder="그룹명(한글)"
                  />
                  <input
                    value={entry.nameEn}
                    onChange={(e) => updateEntry(idx, (prev) => ({ ...(prev as ManagedPricingGroup), nameEn: e.target.value }))}
                    className="h-10 rounded-md border border-white/20 bg-black/30 px-2 text-sm text-tone-strong"
                    placeholder="Group name (EN)"
                  />
                </div>
                <div className="space-y-2">
                  {entry.rows.map((row, rowIdx) => (
                    <div key={`${entry.id}-${rowIdx}`} className="grid gap-2 rounded-lg border border-white/10 bg-black/20 p-2 md:grid-cols-4">
                      <input
                        value={row.name}
                        onChange={(e) =>
                          updateEntry(idx, (prev) => {
                            const group = { ...(prev as ManagedPricingGroup), rows: [...(prev as ManagedPricingGroup).rows] };
                            group.rows[rowIdx] = { ...group.rows[rowIdx], name: e.target.value };
                            return group;
                          })
                        }
                        className="h-9 rounded-md border border-white/20 bg-black/30 px-2 text-xs text-tone-strong"
                        placeholder="한글 지역명"
                      />
                      <input
                        value={row.nameEn}
                        onChange={(e) =>
                          updateEntry(idx, (prev) => {
                            const group = { ...(prev as ManagedPricingGroup), rows: [...(prev as ManagedPricingGroup).rows] };
                            group.rows[rowIdx] = { ...group.rows[rowIdx], nameEn: e.target.value };
                            return group;
                          })
                        }
                        className="h-9 rounded-md border border-white/20 bg-black/30 px-2 text-xs text-tone-strong"
                        placeholder="English name"
                      />
                      <input
                        type="number"
                        value={row.gimpo}
                        onChange={(e) =>
                          updateEntry(idx, (prev) => {
                            const group = { ...(prev as ManagedPricingGroup), rows: [...(prev as ManagedPricingGroup).rows] };
                            group.rows[rowIdx] = { ...group.rows[rowIdx], gimpo: Number(e.target.value) || 0 };
                            return group;
                          })
                        }
                        className="h-9 rounded-md border border-white/20 bg-black/30 px-2 text-xs text-tone-strong"
                        placeholder="김포"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={row.incheon}
                          onChange={(e) =>
                            updateEntry(idx, (prev) => {
                              const group = { ...(prev as ManagedPricingGroup), rows: [...(prev as ManagedPricingGroup).rows] };
                              group.rows[rowIdx] = { ...group.rows[rowIdx], incheon: Number(e.target.value) || 0 };
                              return group;
                            })
                          }
                          className="h-9 flex-1 rounded-md border border-white/20 bg-black/30 px-2 text-xs text-tone-strong"
                          placeholder="인천"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateEntry(idx, (prev) => {
                              const group = { ...(prev as ManagedPricingGroup), rows: (prev as ManagedPricingGroup).rows.filter((_, i) => i !== rowIdx) };
                              return group;
                            })
                          }
                          className="h-9 rounded-md border border-rose-400/35 bg-rose-900/30 px-2 text-xs text-rose-200"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      updateEntry(idx, (prev) => ({
                        ...(prev as ManagedPricingGroup),
                        rows: [...(prev as ManagedPricingGroup).rows, emptyRow()],
                      }))
                    }
                    className="rounded-md border border-white/20 bg-black/30 px-3 py-1.5 text-xs text-tone-strong"
                  >
                    + 그룹 하위 행 추가
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEntry(idx)}
                    className="rounded-md border border-rose-400/35 bg-rose-900/25 px-3 py-1.5 text-xs text-rose-200"
                  >
                    그룹 삭제
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-2 md:grid-cols-5">
                <input
                  value={entry.name}
                  onChange={(e) => updateEntry(idx, (prev) => ({ ...(prev as ManagedPricingRow), name: e.target.value }))}
                  className="h-10 rounded-md border border-white/20 bg-black/30 px-2 text-sm text-tone-strong"
                  placeholder="한글 지역명"
                />
                <input
                  value={entry.nameEn}
                  onChange={(e) => updateEntry(idx, (prev) => ({ ...(prev as ManagedPricingRow), nameEn: e.target.value }))}
                  className="h-10 rounded-md border border-white/20 bg-black/30 px-2 text-sm text-tone-strong"
                  placeholder="English name"
                />
                <input
                  type="number"
                  value={entry.gimpo}
                  onChange={(e) => updateEntry(idx, (prev) => ({ ...(prev as ManagedPricingRow), gimpo: Number(e.target.value) || 0 }))}
                  className="h-10 rounded-md border border-white/20 bg-black/30 px-2 text-sm text-tone-strong"
                  placeholder="김포"
                />
                <input
                  type="number"
                  value={entry.incheon}
                  onChange={(e) => updateEntry(idx, (prev) => ({ ...(prev as ManagedPricingRow), incheon: Number(e.target.value) || 0 }))}
                  className="h-10 rounded-md border border-white/20 bg-black/30 px-2 text-sm text-tone-strong"
                  placeholder="인천"
                />
                <button
                  type="button"
                  onClick={() => removeEntry(idx)}
                  className="h-10 rounded-md border border-rose-400/35 bg-rose-900/25 px-2 text-sm text-rose-200"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            updateRegion(activeRegion.id, (region) => ({
              ...region,
              rows: [...region.rows, emptyRow()],
            }))
          }
          className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-xs text-tone-strong"
        >
          + 일반 행 추가
        </button>
        <button
          type="button"
          onClick={() =>
            updateRegion(activeRegion.id, (region) => ({
              ...region,
              rows: [
                ...region.rows,
                { group: true, id: uid("group"), name: "새 그룹", nameEn: "New Group", rows: [emptyRow()] },
              ],
            }))
          }
          className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-xs text-tone-strong"
        >
          + 그룹 행 추가
        </button>
      </div>

      {!hidePersistenceBar ? (
        <div className="flex items-center gap-3 rounded-xl border border-metal-bronze/25 bg-[#0a1522] px-4 py-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-brand-gold to-[#b8892a] px-5 text-sm font-bold text-black disabled:opacity-60"
          >
            {saving ? "저장 중..." : "상세 요금표 저장"}
          </button>
          <button
            type="button"
            onClick={() => void onReset()}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/20 bg-black/30 px-4 text-sm font-semibold text-tone-strong"
          >
            저장값 다시 불러오기
          </button>
          {message ? <p className="text-sm text-tone-sky">{message}</p> : null}
        </div>
      ) : message ? (
        <p className="text-sm text-tone-sky">{message}</p>
      ) : null}
    </div>
  );
}
