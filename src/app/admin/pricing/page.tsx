import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { AdminPricingVisualEditor } from "@/components/admin/AdminPricingVisualEditor";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getManagedPricingRegions } from "@/lib/pricing-table-store";
import { listReservations } from "@/lib/reservation-store";
import { getSiteSettings } from "@/lib/site-settings-store";
import {
  SITE_FACEBOOK_MESSENGER_URL,
  SITE_INSTAGRAM_DM_URL,
  SITE_KAKAO_CHAT_URL,
  SITE_LINE_URL,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site";
import { listSupportInquiries } from "@/lib/support-inquiry-store";
import { redirect } from "next/navigation";
import en from "../../../../messages/en.json";
import ja from "../../../../messages/ja.json";
import ko from "../../../../messages/ko.json";
import zh from "../../../../messages/zh.json";

export default async function AdminPricingPage() {
  if (!isAdminAuthenticated()) redirect("/admin");

  const [regions, reservations, inquiries, settings] = await Promise.all([
    getManagedPricingRegions(),
    listReservations(),
    listSupportInquiries(),
    getSiteSettings(),
  ]);

  const runtimeConfig = {
    phoneDisplay: settings.phoneDisplay,
    phoneTel: settings.phoneTel || SITE_PHONE_TEL,
    links: {
      kakao: settings.contactLinks.kakao || SITE_KAKAO_CHAT_URL,
      instagram: settings.contactLinks.instagram || SITE_INSTAGRAM_DM_URL,
      whatsapp: settings.contactLinks.whatsapp || SITE_WHATSAPP_URL,
      line: settings.contactLinks.line || SITE_LINE_URL,
      messenger: settings.contactLinks.messenger || SITE_FACEBOOK_MESSENGER_URL,
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">요금안내 비주얼 편집</h1>
      <p className="mt-2 text-sm text-tone-body">
        공개 <code>/pricing</code>과 동일한 레이아웃으로 표 데이터를 미리 보면서 수정합니다. 상단 저장 시 즉시 반영됩니다.
      </p>

      <AdminNavTabs
        currentPath="/admin/pricing"
        reservationsCount={reservations.length}
        inquiriesCount={inquiries.length}
      />

      <div className="mt-6">
        <AdminPricingVisualEditor
          initialRegions={regions}
          runtimeConfig={runtimeConfig}
          messagesByLocale={{ ko, en, ja, zh }}
        />
      </div>
    </div>
  );
}
