import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export type SupportInquiryRecord = {
  id: string;
  createdAt: string;
  locale: string;
  name: string;
  phone: string;
  departure: string;
  destination: string;
  travelDate: string;
  travelTime: string;
  passengers: string;
  message: string;
  outOfMetroArea: boolean;
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "support-inquiries.json");

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf-8");
  } catch {
    await writeFile(FILE, "[]", "utf-8");
  }
}

export async function listSupportInquiries(): Promise<SupportInquiryRecord[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("support_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((row) => ({
        id: String(row.id),
        createdAt: String(row.created_at),
        locale: String(row.locale),
        name: String(row.name),
        phone: String(row.phone),
        departure: String(row.departure),
        destination: String(row.destination),
        travelDate: String(row.travel_date),
        travelTime: String(row.travel_time),
        passengers: String(row.passengers),
        message: row.message ? String(row.message) : "",
        outOfMetroArea: Boolean(row.out_of_metro_area),
      }));
    }
  }

  await ensureStore();
  const raw = await readFile(FILE, "utf-8");
  const parsed = JSON.parse(raw) as SupportInquiryRecord[];
  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveSupportInquiry(record: SupportInquiryRecord): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("support_inquiries").insert({
      id: record.id,
      created_at: record.createdAt,
      locale: record.locale,
      name: record.name,
      phone: record.phone,
      departure: record.departure,
      destination: record.destination,
      travel_date: record.travelDate,
      travel_time: record.travelTime,
      passengers: record.passengers,
      message: record.message,
      out_of_metro_area: record.outOfMetroArea,
    });
    if (!error) return;
  }

  const list = await listSupportInquiries();
  list.unshift(record);
  await writeFile(FILE, JSON.stringify(list, null, 2), "utf-8");
}
