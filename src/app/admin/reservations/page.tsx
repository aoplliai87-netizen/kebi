import { AdminReservationsTable } from "@/components/admin/AdminReservationsTable";
import { listReservations } from "@/lib/reservation-store";

type Props = {
  searchParams?: { key?: string };
};

export default async function ReservationsAdminPage({ searchParams }: Props) {
  const requiredKey = process.env.ADMIN_RESERVATIONS_KEY;
  const providedKey = searchParams?.key;

  if (requiredKey && providedKey !== requiredKey) {
    return (
      <div className="mx-auto max-w-content px-4 py-16">
        <div className="rounded-2xl border border-metal-bronze/35 bg-black/35 p-6 text-tone-body">
          <h1 className="text-2xl font-semibold text-tone-strong">예약 관리자 접근 제한</h1>
          <p className="mt-3">비밀 키가 올바르지 않습니다. 올바른 URL로 접속해 주세요.</p>
        </div>
      </div>
    );
  }

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
