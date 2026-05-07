import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { getManagedPricingRegions, saveManagedPricingRegions } from "@/lib/pricing-table-store";
import type {
  ManagedPricingEntry,
  ManagedPricingRegion,
  ManagedPricingRow,
} from "@/lib/pricing-table-types";
import { isManagedPricingGroup } from "@/lib/pricing-table-types";

function parseRow(v: unknown): ManagedPricingRow | null {
  if (!v || typeof v !== "object") return null;
  const row = v as Partial<ManagedPricingRow>;
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const nameEn = typeof row.nameEn === "string" ? row.nameEn.trim() : "";
  const gimpo = Number(row.gimpo);
  const incheon = Number(row.incheon);
  if (!name || !nameEn || !Number.isFinite(gimpo) || !Number.isFinite(incheon)) return null;
  return { name, nameEn, gimpo: Math.max(0, Math.round(gimpo)), incheon: Math.max(0, Math.round(incheon)) };
}

function parseEntry(v: unknown): ManagedPricingEntry | null {
  if (!v || typeof v !== "object") return null;
  const raw = v as { group?: boolean; id?: string; name?: string; nameEn?: string; rows?: unknown[] };
  if (raw.group === true) {
    const id = typeof raw.id === "string" ? raw.id.trim() : "";
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    const nameEn = typeof raw.nameEn === "string" ? raw.nameEn.trim() : "";
    const rows = (Array.isArray(raw.rows) ? raw.rows : []).map(parseRow).filter((r): r is ManagedPricingRow => Boolean(r));
    if (!id || !name || !nameEn || rows.length === 0) return null;
    return { group: true, id, name, nameEn, rows };
  }
  return parseRow(v);
}

function parseRegion(v: unknown): ManagedPricingRegion | null {
  if (!v || typeof v !== "object") return null;
  const raw = v as Partial<ManagedPricingRegion>;
  const id = typeof raw.id === "string" ? raw.id.trim() : "";
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const nameEn = typeof raw.nameEn === "string" ? raw.nameEn.trim() : "";
  const rows = (Array.isArray(raw.rows) ? raw.rows : []).map(parseEntry).filter((e): e is ManagedPricingEntry => Boolean(e));
  if (!id || !name || !nameEn) return null;
  return { id, name, nameEn, rows };
}

function hasAtLeastOneRow(region: ManagedPricingRegion) {
  return region.rows.some((entry) => (isManagedPricingGroup(entry) ? entry.rows.length > 0 : true));
}

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const regions = await getManagedPricingRegions();
  return NextResponse.json({ ok: true, regions });
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { regions?: unknown };
    if (!Array.isArray(body.regions)) {
      return NextResponse.json({ ok: false, message: "regions 배열이 필요합니다." }, { status: 400 });
    }
    const regions = body.regions.map(parseRegion).filter((r): r is ManagedPricingRegion => Boolean(r));
    if (regions.length === 0) {
      return NextResponse.json({ ok: false, message: "유효한 지역 데이터가 없습니다." }, { status: 400 });
    }
    if (!regions.some((r) => r.id === "seoul") || !regions.some((r) => r.id === "gyeonggi")) {
      return NextResponse.json({ ok: false, message: "서울/경기 지역은 필수입니다." }, { status: 400 });
    }
    if (regions.some((region) => !hasAtLeastOneRow(region))) {
      return NextResponse.json({ ok: false, message: "모든 지역에 최소 1개 이상의 요금 행이 필요합니다." }, { status: 400 });
    }
    await saveManagedPricingRegions(regions);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
