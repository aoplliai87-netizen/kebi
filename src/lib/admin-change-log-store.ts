import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export type AdminChangeLog = {
  id: string;
  createdAt: string;
  actor: string;
  summary: string;
  changes: Record<string, { before: unknown; after: unknown }>;
  clientIp?: string;
  userAgent?: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "admin-change-logs.json");

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(FILE, "utf-8");
  } catch {
    await writeFile(FILE, "[]", "utf-8");
  }
}

export async function appendAdminChangeLog(log: AdminChangeLog) {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("admin_change_logs").insert({
      id: log.id,
      created_at: log.createdAt,
      actor: log.actor,
      summary: log.summary,
      changes: log.changes,
      client_ip: log.clientIp ?? null,
      user_agent: log.userAgent ?? null,
    });
    if (!error) return;
  }

  await ensureStore();
  const current = await listAdminChangeLogs(500);
  current.unshift(log);
  await writeFile(FILE, JSON.stringify(current, null, 2), "utf-8");
}

export async function listAdminChangeLogs(limit = 30): Promise<AdminChangeLog[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("admin_change_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (!error && data) {
      return data.map((row) => ({
        id: String(row.id),
        createdAt: String(row.created_at),
        actor: String(row.actor ?? "admin"),
        summary: String(row.summary ?? ""),
        changes:
          row.changes && typeof row.changes === "object"
            ? (row.changes as Record<string, { before: unknown; after: unknown }>)
            : {},
        clientIp: row.client_ip ? String(row.client_ip) : undefined,
        userAgent: row.user_agent ? String(row.user_agent) : undefined,
      }));
    }
  }

  await ensureStore();
  try {
    const raw = await readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as AdminChangeLog[];
    return parsed.slice(0, limit);
  } catch {
    return [];
  }
}
