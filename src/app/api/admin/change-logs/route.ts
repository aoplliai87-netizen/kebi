import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { listAdminChangeLogs } from "@/lib/admin-change-log-store";

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "20");
  const logs = await listAdminChangeLogs(Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 20);
  return NextResponse.json({ ok: true, logs });
}
