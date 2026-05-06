import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSupabaseServerClient } from "@/lib/supabase-server";

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
  /** 성인·소아 구분 저장 (선택) */
  adultPassengers?: number;
  childPassengers?: number;
  golfBags?: number;
  waypointsSummary?: string;
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
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((row) => ({
        id: String(row.id),
        createdAt: String(row.created_at),
        status: row.status as ReservationStatus,
        locale: String(row.locale),
        name: String(row.name),
        phone: String(row.phone),
        serviceType: String(row.service_type),
        travelDate: String(row.travel_date),
        travelTime: String(row.travel_time),
        startPoint: String(row.start_point),
        destination: String(row.destination),
        airport: String(row.airport),
        flightNo: row.flight_no ? String(row.flight_no) : undefined,
        vehicle: String(row.vehicle),
        passengers: Number(row.passengers),
        luggage: Number(row.luggage),
        adultPassengers:
          row.adult_passengers != null ? Number(row.adult_passengers) : undefined,
        childPassengers:
          row.child_passengers != null ? Number(row.child_passengers) : undefined,
        golfBags: row.golf_bags != null ? Number(row.golf_bags) : undefined,
        waypointsSummary: row.waypoints_summary ? String(row.waypoints_summary) : undefined,
        preferredMessenger: String(row.preferred_messenger),
      }));
    }
  }

  await ensureStore();
  const raw = await readFile(RESERVATION_FILE, "utf-8");
  const parsed = JSON.parse(raw) as ReservationRecord[];
  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveReservation(record: ReservationRecord): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("reservations").insert({
      id: record.id,
      created_at: record.createdAt,
      status: record.status,
      locale: record.locale,
      name: record.name,
      phone: record.phone,
      service_type: record.serviceType,
      travel_date: record.travelDate,
      travel_time: record.travelTime,
      start_point: record.startPoint,
      destination: record.destination,
      airport: record.airport,
      flight_no: record.flightNo ?? null,
      vehicle: record.vehicle,
      passengers: record.passengers,
      luggage: record.luggage,
      adult_passengers: record.adultPassengers ?? null,
      child_passengers: record.childPassengers ?? null,
      golf_bags: record.golfBags ?? null,
      waypoints_summary: record.waypointsSummary ?? null,
      preferred_messenger: record.preferredMessenger,
    });
    if (!error) return;
  }

  const records = await listReservations();
  records.unshift(record);
  await writeFile(RESERVATION_FILE, JSON.stringify(records, null, 2), "utf-8");
}
