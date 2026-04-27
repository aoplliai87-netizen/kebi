import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type ReservationStatus = "대기" | "확정" | "취소";

export type ReservationRecord = {
  id: string;
  createdAt: string;
  status: ReservationStatus;
  locale: string;
  name: string;
  phone: string;
  serviceType: string;
  travelDate: string;
  travelTime: string;
  startPoint: string;
  destination: string;
  airport: string;
  flightNo?: string;
  vehicle: string;
  passengers: number;
  luggage: number;
  preferredMessenger: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const RESERVATION_FILE = path.join(DATA_DIR, "reservations.json");

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(RESERVATION_FILE, "utf-8");
  } catch {
    await writeFile(RESERVATION_FILE, "[]", "utf-8");
  }
}

export async function listReservations(): Promise<ReservationRecord[]> {
  await ensureStore();
  const raw = await readFile(RESERVATION_FILE, "utf-8");
  const parsed = JSON.parse(raw) as ReservationRecord[];
  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveReservation(record: ReservationRecord): Promise<void> {
  const records = await listReservations();
  records.unshift(record);
  await writeFile(RESERVATION_FILE, JSON.stringify(records, null, 2), "utf-8");
}
