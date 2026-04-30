import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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
  await ensureStore();
  const raw = await readFile(FILE, "utf-8");
  const parsed = JSON.parse(raw) as SupportInquiryRecord[];
  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveSupportInquiry(record: SupportInquiryRecord): Promise<void> {
  const list = await listSupportInquiries();
  list.unshift(record);
  await writeFile(FILE, JSON.stringify(list, null, 2), "utf-8");
}
