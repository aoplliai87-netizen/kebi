import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { VEHICLE_FLEET_MAIN, type FleetVehicleKey } from "@/constants/vehicleFleetImages";
import type { ManagedVehicleMedia } from "@/lib/vehicle-media-types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "vehicle-media.json");

const EMPTY_SLOTS = [null, null, null, null, null, null] as const;

const DEFAULT_MEDIA: ManagedVehicleMedia = {
  main: {
    staria: VEHICLE_FLEET_MAIN.staria,
    solati: VEHICLE_FLEET_MAIN.solati,
    county: VEHICLE_FLEET_MAIN.county,
  },
  interior: {
    staria: [VEHICLE_FLEET_MAIN.staria, ...EMPTY_SLOTS.slice(1)],
    solati: [VEHICLE_FLEET_MAIN.solati, ...EMPTY_SLOTS.slice(1)],
    county: [VEHICLE_FLEET_MAIN.county, ...EMPTY_SLOTS.slice(1)],
  },
};

function parseMain(value: unknown, key: FleetVehicleKey) {
  if (typeof value === "string" && value.trim()) return value.trim();
  return DEFAULT_MEDIA.main[key];
}

function parseInterior(value: unknown, key: FleetVehicleKey) {
  if (!Array.isArray(value)) return [...DEFAULT_MEDIA.interior[key]];
  const normalized = value.slice(0, 6).map((v) => (typeof v === "string" && v.trim() ? v.trim() : null));
  while (normalized.length < 6) normalized.push(null);
  return normalized;
}

function parseMedia(value: unknown): ManagedVehicleMedia {
  const v = value && typeof value === "object" ? (value as Partial<ManagedVehicleMedia>) : {};
  const mainRaw = v.main && typeof v.main === "object" ? v.main : {};
  const interiorRaw = v.interior && typeof v.interior === "object" ? v.interior : {};
  return {
    main: {
      staria: parseMain((mainRaw as Record<FleetVehicleKey, unknown>).staria, "staria"),
      solati: parseMain((mainRaw as Record<FleetVehicleKey, unknown>).solati, "solati"),
      county: parseMain((mainRaw as Record<FleetVehicleKey, unknown>).county, "county"),
    },
    interior: {
      staria: parseInterior((interiorRaw as Record<FleetVehicleKey, unknown>).staria, "staria"),
      solati: parseInterior((interiorRaw as Record<FleetVehicleKey, unknown>).solati, "solati"),
      county: parseInterior((interiorRaw as Record<FleetVehicleKey, unknown>).county, "county"),
    },
  };
}

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf-8");
  } catch {
    await writeFile(FILE, JSON.stringify(DEFAULT_MEDIA, null, 2), "utf-8");
  }
}

export async function getManagedVehicleMedia(): Promise<ManagedVehicleMedia> {
  await ensureStore();
  try {
    const raw = await readFile(FILE, "utf-8");
    return parseMedia(JSON.parse(raw) as unknown);
  } catch {
    return DEFAULT_MEDIA;
  }
}

export async function saveManagedVehicleMedia(nextMedia: ManagedVehicleMedia) {
  await ensureStore();
  await writeFile(FILE, JSON.stringify(nextMedia, null, 2), "utf-8");
}
