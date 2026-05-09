import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { AdminSeoSettingsForm } from "@/components/admin/AdminSeoSettingsForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { buildAdminSeoFallbacks, buildAllDestinationSlugSeoFallbacks } from "@/lib/admin-seo-fallbacks";
import { getAllDestinationSlugs } from "../../../../data/landing-pages";
import { listReservations } from "@/lib/reservation-store";
import { getSiteSettings } from "@/lib/site-settings-store";
import { listSupportInquiries } from "@/lib/support-inquiry-store";
import { redirect } from "next/navigation";

export default async function AdminSeoPage() {
  if (!isAdminAuthenticated()) redirect("/admin");

  const [settings, reservations, inquiries, fallback] = await Promise.all([
    getSiteSettings(),
    listReservations(),
    listSupportInquiries(),
    buildAdminSeoFallbacks(),
  ]);

  const destinationSlugFallbacks = buildAllDestinationSlugSeoFallbacks();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">SEO 전용 관리자</h1>
      <p className="mt-2 text-sm text-tone-body">
        페이지별/언어별 메타 타이틀·설명·OG·캐노니컬·키워드를 관리합니다. 저장값은 공개 페이지 `generateMetadata`에서 우선 적용됩니다.
      </p>
      <AdminNavTabs
        currentPath="/admin/seo"
        reservationsCount={reservations.length}
        inquiriesCount={inquiries.length}
      />
      <div className="mt-6">
        <AdminSeoSettingsForm
          initial={settings}
          fallback={fallback}
          destinationSlugs={getAllDestinationSlugs()}
          destinationSlugFallbacks={destinationSlugFallbacks}
        />
      </div>
    </div>
  );
}
