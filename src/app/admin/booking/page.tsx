import { AdminBookingVisualEditor } from "@/components/admin/AdminBookingVisualEditor";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { AdminSiteSettingsForm } from "@/components/admin/AdminSiteSettingsForm";
import { buildAdminContentFallbacks } from "@/lib/admin-content-fallbacks";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listReservations } from "@/lib/reservation-store";
import { getSiteSettings } from "@/lib/site-settings-store";
import { SITE_FACEBOOK_MESSENGER_URL, SITE_INSTAGRAM_DM_URL, SITE_KAKAO_CHAT_URL, SITE_LINE_URL, SITE_WHATSAPP_URL } from "@/lib/site";
import { listSupportInquiries } from "@/lib/support-inquiry-store";
import { redirect } from "next/navigation";
import en from "../../../../messages/en.json";
import ja from "../../../../messages/ja.json";
import ko from "../../../../messages/ko.json";
import zh from "../../../../messages/zh.json";

export default async function AdminBookingPage() {
  if (!isAdminAuthenticated()) redirect("/admin");
  const [settings, reservations, inquiries, fallbackHints] = await Promise.all([
    getSiteSettings(),
    listReservations(),
    listSupportInquiries(),
    buildAdminContentFallbacks(),
  ]);
  const mergedContact = {
    kakao: settings.contactLinks.kakao || SITE_KAKAO_CHAT_URL,
    instagram: settings.contactLinks.instagram || SITE_INSTAGRAM_DM_URL,
    whatsapp: settings.contactLinks.whatsapp || SITE_WHATSAPP_URL,
    line: settings.contactLinks.line || SITE_LINE_URL,
    messenger: settings.contactLinks.messenger || SITE_FACEBOOK_MESSENGER_URL,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">예약 비주얼 에디터</h1>
      <p className="mt-2 text-sm text-tone-body">실제 공개 `/booking` 화면과 동일한 컴포넌트 위에서 바로 수정합니다.</p>
      <AdminNavTabs currentPath="/admin/booking" reservationsCount={reservations.length} inquiriesCount={inquiries.length} />
      <div className="mt-6">
        <AdminBookingVisualEditor
          initial={settings}
          fallbackHints={fallbackHints}
          messagesByLocale={{ ko, en, ja, zh }}
          mergedContact={mergedContact}
        />
      </div>
      <details className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-tone-strong">고급 편집 (기존 폼)</summary>
        <div className="mt-4">
          <AdminSiteSettingsForm initial={settings} fallbackHints={fallbackHints} initialTab="subpages" allowedTabs={["subpages"]} />
        </div>
      </details>
    </div>
  );
}
