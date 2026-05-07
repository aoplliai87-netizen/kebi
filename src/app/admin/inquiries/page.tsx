import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listReservations } from "@/lib/reservation-store";
import { listSupportInquiries } from "@/lib/support-inquiry-store";
import { redirect } from "next/navigation";

export default async function InquiriesAdminPage() {
  if (!isAdminAuthenticated()) redirect("/admin");

  const [rows, reservations] = await Promise.all([
    listSupportInquiries(),
    listReservations(),
  ]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">문의 관리자 페이지</h1>
      <p className="mt-2 text-sm text-tone-body">홈 문의 폼으로 들어온 내역을 확인할 수 있습니다.</p>
      <AdminNavTabs
        currentPath="/admin/inquiries"
        reservationsCount={reservations.length}
        inquiriesCount={rows.length}
      />
      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/12 bg-black/30 p-6 text-tone-body">
          접수된 문의가 없습니다.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#081121]/80">
          <table className="min-w-[1000px] w-full text-left">
            <thead className="bg-brand-deep/60 text-xs uppercase tracking-[0.14em] text-metal-bronze-strong">
              <tr>
                <th className="px-4 py-3">접수 시각</th>
                <th className="px-4 py-3">고객 정보</th>
                <th className="px-4 py-3">구간</th>
                <th className="px-4 py-3">일정</th>
                <th className="px-4 py-3">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm text-tone-body">
              {rows.map((row) => (
                <tr key={row.id} className="align-top">
                  <td className="px-4 py-4 text-xs text-tone-soft">
                    {new Date(row.createdAt).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-tone-strong">{row.name}</p>
                    <p>{row.phone}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p>
                      {row.departure} → {row.destination}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p>
                      {row.travelDate} {row.travelTime}
                    </p>
                    <p className="text-xs text-tone-soft">인원: {row.passengers}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-tone-soft">
                      기타지역: {row.outOfMetroArea ? "예" : "아니오"}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">{row.message || "-"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
