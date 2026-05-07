import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pricingRegions, isPricingRegionGroup } from "@/constants/pricingData";
import type { ManagedPricingEntry, ManagedPricingRegion, ManagedPricingRow } from "@/lib/pricing-table-types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "pricing-table.json");

function toManagedRow(row: {
  name: string;
  nameEn: string;
  gimpo: number;
  incheon: number;
}): ManagedPricingRow {
  return {
    name: row.name,
    nameEn: row.nameEn,
    gimpo: row.gimpo,
    incheon: row.incheon,
  };
}

function buildDefaultRegions(): ManagedPricingRegion[] {
  return pricingRegions
    .filter((region) => region.id === "seoul" || region.id === "gyeonggi")
    .map((region) => ({
    id: region.id,
    name: region.name,
    nameEn: region.nameEn,
    rows: region.rows.map((entry): ManagedPricingEntry => {
      if (isPricingRegionGroup(entry)) {
        return {
          group: true,
          id: entry.id,
          name: entry.name,
          nameEn: entry.nameEn,
          rows: entry.rows.map((r) => toManagedRow(r)),
        };
      }
      return toManagedRow(entry);
    }),
  }));
}

function parseRow(value: unknown): ManagedPricingRow | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<ManagedPricingRow>;
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const nameEn = typeof row.nameEn === "string" ? row.nameEn.trim() : "";
  const gimpo = Number(row.gimpo);
  const incheon = Number(row.incheon);
  if (!name || !nameEn || !Number.isFinite(gimpo) || !Number.isFinite(incheon)) return null;
  return { name, nameEn, gimpo: Math.max(0, Math.round(gimpo)), incheon: Math.max(0, Math.round(incheon)) };
}

function parseEntry(value: unknown): ManagedPricingEntry | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<ManagedPricingEntry>;
  if ("group" in v && v.group === true) {
    const id = typeof (v as { id?: string }).id === "string" ? (v as { id?: string }).id!.trim() : "";
    const name = typeof (v as { name?: string }).name === "string" ? (v as { name?: string }).name!.trim() : "";
    const nameEn = typeof (v as { nameEn?: string }).nameEn === "string" ? (v as { nameEn?: string }).nameEn!.trim() : "";
    const rowsRaw = Array.isArray((v as { rows?: unknown[] }).rows) ? (v as { rows?: unknown[] }).rows! : [];
    const rows = rowsRaw.map(parseRow).filter((r): r is ManagedPricingRow => Boolean(r));
    if (!id || !name || !nameEn || rows.length === 0) return null;
    return { group: true, id, name, nameEn, rows };
  }
  return parseRow(value);
}

function parseRegion(value: unknown): ManagedPricingRegion | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<ManagedPricingRegion>;
  const id = typeof v.id === "string" ? v.id.trim() : "";
  const name = typeof v.name === "string" ? v.name.trim() : "";
  const nameEn = typeof v.nameEn === "string" ? v.nameEn.trim() : "";
  const rowsRaw = Array.isArray(v.rows) ? v.rows : [];
  const rows = rowsRaw.map(parseEntry).filter((e): e is ManagedPricingEntry => Boolean(e));
  if (!id || !name || !nameEn) return null;
  return { id, name, nameEn, rows };
}

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf-8");
  } catch {
    await writeFile(FILE, JSON.stringify(buildDefaultRegions(), null, 2), "utf-8");
  }
}

export async function getManagedPricingRegions(): Promise<ManagedPricingRegion[]> {
  await ensureStore();
  try {
    const raw = await readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return buildDefaultRegions();
    const regions = parsed
      .map(parseRegion)
      .filter((r): r is ManagedPricingRegion => Boolean(r))
      .filter((region) => region.id === "seoul" || region.id === "gyeonggi");
    return regions.length > 0 ? regions : buildDefaultRegions();
  } catch {
    return buildDefaultRegions();
  }
}

export async function saveManagedPricingRegions(regions: ManagedPricingRegion[]) {
  await ensureStore();
  await writeFile(FILE, JSON.stringify(regions, null, 2), "utf-8");
}
