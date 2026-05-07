import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import {
  getManagedVehicleMedia,
  saveManagedVehicleMedia,
} from "@/lib/vehicle-media-store";
import {
  getManagedVehiclePageContent,
  saveManagedVehiclePageContent,
} from "@/lib/vehicle-page-content-store";
import { parseVehiclePageContent } from "@/lib/vehicle-page-content";
import type { FleetVehicleKey } from "@/constants/vehicleFleetImages";
import type { ManagedVehicleMedia } from "@/lib/vehicle-media-types";

const VEHICLE_KEYS: FleetVehicleKey[] = ["staria", "solati", "county"];

function parsePayload(value: unknown): ManagedVehicleMedia | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<ManagedVehicleMedia>;
  const main = {} as Record<FleetVehicleKey, string>;
  const interior = {} as Record<FleetVehicleKey, (string | null)[]>;

  for (const key of VEHICLE_KEYS) {
    const m = v.main && typeof v.main === "object" ? (v.main as Record<FleetVehicleKey, unknown>)[key] : "";
    if (typeof m !== "string" || !m.trim()) return null;
    main[key] = m.trim();

    const slotsRaw =
      v.interior && typeof v.interior === "object"
        ? (v.interior as Record<FleetVehicleKey, unknown>)[key]
        : [];
    if (!Array.isArray(slotsRaw)) return null;
    const slots = slotsRaw.slice(0, 6).map((s) => (typeof s === "string" && s.trim() ? s.trim() : null));
    while (slots.length < 6) slots.push(null);
    interior[key] = slots;
  }

  return { main, interior };
}

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const [media, content] = await Promise.all([
    getManagedVehicleMedia(),
    getManagedVehiclePageContent(),
  ]);
  return NextResponse.json({ ok: true, media, content });
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { media?: unknown; content?: unknown };
    const media = parsePayload(body.media);
    if (!media) {
      return NextResponse.json({ ok: false, message: "차량 이미지 입력값이 올바르지 않습니다." }, { status: 400 });
    }
    const content =
      body.content === undefined
        ? await getManagedVehiclePageContent()
        : parseVehiclePageContent(body.content);
    await Promise.all([saveManagedVehicleMedia(media), saveManagedVehiclePageContent(content)]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
