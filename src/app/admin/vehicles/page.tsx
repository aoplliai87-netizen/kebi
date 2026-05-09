import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { AdminVehicleVisualEditor } from "@/components/admin/AdminVehicleVisualEditor";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listReservations } from "@/lib/reservation-store";
import { listSupportInquiries } from "@/lib/support-inquiry-store";
import { getManagedVehicleMedia } from "@/lib/vehicle-media-store";
import { getManagedVehiclePageContent } from "@/lib/vehicle-page-content-store";
import { redirect } from "next/navigation";

export default async function AdminVehiclesPage() {
  if (!isAdminAuthenticated()) redirect("/admin");

  const [media, content, reservations, inquiries, koMessages, enMessages, jaMessages, zhMessages] = await Promise.all([
    getManagedVehicleMedia(),
    getManagedVehiclePageContent(),
    listReservations(),
    listSupportInquiries(),
    import("../../../../messages/ko.json"),
    import("../../../../messages/en.json"),
    import("../../../../messages/ja.json"),
    import("../../../../messages/zh.json"),
  ]);

  const vByLocale = {
    ko: koMessages.default.VehicleFleet,
    en: enMessages.default.VehicleFleet,
    ja: jaMessages.default.VehicleFleet,
    zh: zhMessages.default.VehicleFleet,
  } as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">차량 비주얼 편집기</h1>
      <p className="mt-2 text-sm text-tone-body">
        공개 차량 페이지와 동일한 구조로 문구·이미지를 수정합니다. 메인 컷은{" "}
        <code className="rounded bg-neutral-800/60 px-1.5 py-0.5 text-[13px]">data/vehicle-media.json</code> 과{" "}
        <code className="rounded bg-neutral-800/60 px-1.5 py-0.5 text-[13px]">public/images/vehicles/</code> 실사
        파일을 맞추고, 상세 갤러리 빈 슬롯은 에디터에서 URL을 채우면 됩니다. 차종별{" "}
        <code className="rounded bg-neutral-800/60 px-1.5 py-0.5 text-[13px]">imageAlt</code> 는 검색·스크린리더용으로
        로케일별로
        유지하세요.
      </p>

      <AdminNavTabs
        currentPath="/admin/vehicles"
        reservationsCount={reservations.length}
        inquiriesCount={inquiries.length}
      />

      <div className="mt-6">
        <AdminVehicleVisualEditor initialMedia={media} initialContent={content} defaultsByLocale={vByLocale} />
      </div>

    </div>
  );
}
