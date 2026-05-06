import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listReservations } from "@/lib/reservation-store";
import { listReviews } from "@/lib/review-store";
import { listSupportInquiries } from "@/lib/support-inquiry-store";

export default async function AdminPage() {
  if (!isAdminAuthenticated()) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-content items-center justify-center px-4 py-12">
        <AdminLoginForm />
      </div>
    );
  }

  const [reservations, inquiries, reviews] = await Promise.all([
    listReservations(),
    listSupportInquiries(),
    listReviews(),
  ]);

  const totalContacts = reservations.length + inquiries.length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthReservations = reservations.filter((v) => v.createdAt.startsWith(thisMonth)).length;
  const monthInquiries = inquiries.filter((v) => v.createdAt.startsWith(thisMonth)).length;

  return (
    <div className="mx-auto max-w-content px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">관리자 대시보드</h1>
          <p className="mt-2 text-sm text-tone-body">
            예약/문의 집계와 콘텐츠 수정을 한 곳에서 관리할 수 있습니다.
          </p>
        </div>
        <AdminLogoutButton />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/12 bg-black/30 p-4">
          <p className="text-xs text-tone-soft">총 예약</p>
          <p className="mt-1 text-2xl font-bold text-tone-strong">{reservations.length}</p>
        </div>
        <div className="rounded-xl border border-white/12 bg-black/30 p-4">
          <p className="text-xs text-tone-soft">총 문의</p>
          <p className="mt-1 text-2xl font-bold text-tone-strong">{inquiries.length}</p>
        </div>
        <div className="rounded-xl border border-white/12 bg-black/30 p-4">
          <p className="text-xs text-tone-soft">이번 달 접수</p>
          <p className="mt-1 text-2xl font-bold text-tone-strong">{monthReservations + monthInquiries}</p>
        </div>
        <div className="rounded-xl border border-white/12 bg-black/30 p-4">
          <p className="text-xs text-tone-soft">전체 리뷰</p>
          <p className="mt-1 text-2xl font-bold text-tone-strong">{reviews.length}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Link
          href="/admin/reservations"
          className="rounded-xl border border-metal-bronze/35 bg-black/30 p-4 text-sm font-semibold text-tone-strong hover:border-metal-bronze-strong"
        >
          예약 관리자
          <p className="mt-1 text-xs font-normal text-tone-soft">상태 확인, 고객 정보 확인</p>
        </Link>
        <Link
          href="/admin/inquiries"
          className="rounded-xl border border-metal-bronze/35 bg-black/30 p-4 text-sm font-semibold text-tone-strong hover:border-metal-bronze-strong"
        >
          문의 관리자
          <p className="mt-1 text-xs font-normal text-tone-soft">문의 내역, 접수 시간 확인</p>
        </Link>
        <Link
          href="/admin/content"
          className="rounded-xl border border-metal-bronze/35 bg-black/30 p-4 text-sm font-semibold text-tone-strong hover:border-metal-bronze-strong"
        >
          콘텐츠 관리
          <p className="mt-1 text-xs font-normal text-tone-soft">About Me 문구, 갤러리 이미지 URL</p>
        </Link>
      </div>
      <a
        href="/api/admin/export"
        className="mt-4 inline-flex h-11 items-center justify-center rounded-lg border border-white/20 bg-black/30 px-4 text-sm font-semibold text-tone-strong hover:border-metal-bronze-strong"
      >
        예약/문의 CSV 다운로드
      </a>
      <p className="mt-5 text-xs text-tone-soft">전화/문의 총 합계: {totalContacts}건</p>
    </div>
  );
}
