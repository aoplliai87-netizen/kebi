import { AdminReservationsTable } from "@/components/admin/AdminReservationsTable";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listReservations } from "@/lib/reservation-store";
import { redirect } from "next/navigation";

export default async function ReservationsAdminPage() {
  if (!isAdminAuthenticated()) redirect("/admin");

  const reservations = await listReservations();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <h1 className='font-sans text-4xl font-bold tracking-[-0.02em] text-tone-strong md:text-5xl'>
        예약 관리자 페이지
      </h1>
      <p className="mt-3 text-tone-body">
        상태(대기/확정/취소), 고객 정보, 구간 정보를 확인하고 필요 시 번역용 텍스트를 복사하세요.
      </p>
      <div className="mt-6">
        <AdminReservationsTable reservations={reservations} />
      </div>
    </div>
  );
}
