import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

let cached: SupabaseClient | null | undefined;

function getEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

export function getSupabaseServerClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = getEnv("SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    cached = null;
    return cached;
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "kebi-admin" } },
  });
  return cached;
}

export function asStringArray(value: Json | undefined, fallback: string[] = []) {
  if (!Array.isArray(value)) return fallback;
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}
