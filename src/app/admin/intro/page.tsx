import { AdminIntroVisualEditor } from "@/components/admin/AdminIntroVisualEditor";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { buildAdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listReservations } from "@/lib/reservation-store";
import { getSiteSettings } from "@/lib/site-settings-store";
import { listSupportInquiries } from "@/lib/support-inquiry-store";
import { redirect } from "next/navigation";
import en from "../../../../messages/en.json";
import ja from "../../../../messages/ja.json";
import ko from "../../../../messages/ko.json";
import zh from "../../../../messages/zh.json";

export default async function AdminIntroPage() {
  if (!isAdminAuthenticated()) redirect("/admin");
  const [settings, reservations, inquiries, fallbackHints] = await Promise.all([
    getSiteSettings(),
    listReservations(),
    listSupportInquiries(),
    buildAdminContentFallbacks(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">소개 비주얼 에디터</h1>
      <p className="mt-2 text-sm text-tone-body">실제 공개 `/intro` 화면과 동일한 컴포넌트 위에서 바로 수정합니다.</p>
      <AdminNavTabs currentPath="/admin/intro" reservationsCount={reservations.length} inquiriesCount={inquiries.length} />
      <div className="mt-6">
        <AdminIntroVisualEditor
          initial={settings}
          fallbackHints={fallbackHints}
          messagesByLocale={{ ko, en, ja, zh }}
        />
      </div>
    </div>
  );
}
