import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { AdminPricingTableEditor } from "@/components/admin/AdminPricingTableEditor";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getManagedPricingRegions } from "@/lib/pricing-table-store";
import { listReservations } from "@/lib/reservation-store";
import { listSupportInquiries } from "@/lib/support-inquiry-store";
import { redirect } from "next/navigation";

export default async function AdminPricingPage() {
  if (!isAdminAuthenticated()) redirect("/admin");

  const [regions, reservations, inquiries] = await Promise.all([
    getManagedPricingRegions(),
    listReservations(),
    listSupportInquiries(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">요금안내 상세표 관리</h1>
      <p className="mt-2 text-sm text-tone-body">
        홈페이지 <code>/pricing</code>의 실제 표 데이터를 직접 수정합니다. 서울/경기 행 추가·삭제와 금액 변경을 지원합니다.
      </p>

      <AdminNavTabs
        currentPath="/admin/pricing"
        reservationsCount={reservations.length}
        inquiriesCount={inquiries.length}
      />

      <div className="mt-6">
        <AdminPricingTableEditor initialRegions={regions} />
      </div>
    </div>
  );
}
