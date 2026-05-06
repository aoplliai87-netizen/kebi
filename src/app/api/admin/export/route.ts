import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { listReservations } from "@/lib/reservation-store";
import { listSupportInquiries } from "@/lib/support-inquiry-store";

function csvEscape(value: string | number | boolean | null | undefined) {
  const text = value == null ? "" : String(value);
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const [reservations, inquiries] = await Promise.all([listReservations(), listSupportInquiries()]);
  const rows = [
    ["type", "createdAt", "name", "phone", "route", "schedule", "extra"],
    ...reservations.map((v) => [
      "reservation",
      v.createdAt,
      v.name,
      v.phone,
      `${v.startPoint} -> ${v.destination}`,
      `${v.travelDate} ${v.travelTime}`,
      `${v.serviceType} / ${v.vehicle} / ${v.passengers}명 / messenger:${v.preferredMessenger}`,
    ]),
    ...inquiries.map((v) => [
      "inquiry",
      v.createdAt,
      v.name,
      v.phone,
      `${v.departure} -> ${v.destination}`,
      `${v.travelDate} ${v.travelTime}`,
      `passengers:${v.passengers} / outOfMetro:${v.outOfMetroArea ? "Y" : "N"} / ${v.message || "-"}`,
    ]),
  ];

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="kebi-admin-export.csv"',
    },
  });
}
