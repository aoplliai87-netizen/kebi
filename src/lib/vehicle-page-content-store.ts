import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  emptyVehiclePageContent,
  parseVehiclePageContent,
  type VehiclePageContent,
} from "@/lib/vehicle-page-content";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "vehicle-page-content.json");

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf-8");
  } catch {
    await writeFile(FILE, JSON.stringify(emptyVehiclePageContent(), null, 2), "utf-8");
  }
}

export async function getManagedVehiclePageContent(): Promise<VehiclePageContent> {
  await ensureStore();
  try {
    const raw = await readFile(FILE, "utf-8");
    return parseVehiclePageContent(JSON.parse(raw) as unknown);
  } catch {
    return emptyVehiclePageContent();
  }
}

export async function saveManagedVehiclePageContent(nextContent: VehiclePageContent) {
  await ensureStore();
  await writeFile(FILE, JSON.stringify(parseVehiclePageContent(nextContent), null, 2), "utf-8");
}
