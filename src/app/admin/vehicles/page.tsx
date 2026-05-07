import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { AdminVehicleMediaEditor } from "@/components/admin/AdminVehicleMediaEditor";
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
        공개 `/ko/vehicle` 레이아웃을 미러로 보면서 텍스트/버튼/이미지 URL을 바로 수정할 수 있습니다.
      </p>

      <AdminNavTabs
        currentPath="/admin/vehicles"
        reservationsCount={reservations.length}
        inquiriesCount={inquiries.length}
      />

      <div className="mt-6">
        <AdminVehicleVisualEditor initialMedia={media} initialContent={content} defaultsByLocale={vByLocale} />
      </div>

      <div className="mt-6">
        <details className="rounded-xl border border-white/12 bg-black/20 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-tone-strong">기존 폼 방식 (고급 편집)</summary>
          <div className="mt-4">
        <AdminVehicleMediaEditor initialMedia={media} />
          </div>
        </details>
      </div>
    </div>
  );
}
