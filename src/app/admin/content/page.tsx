import { AdminHomeVisualEditor } from "@/components/admin/AdminHomeVisualEditor";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listReservations } from "@/lib/reservation-store";
import { getSiteSettings } from "@/lib/site-settings-store";
import { getManagedVehicleMedia } from "@/lib/vehicle-media-store";
import { listSupportInquiries } from "@/lib/support-inquiry-store";
import {
  SITE_FACEBOOK_MESSENGER_URL,
  SITE_INSTAGRAM_DM_URL,
  SITE_KAKAO_CHAT_URL,
  SITE_LINE_URL,
  SITE_WHATSAPP_URL,
} from "@/lib/site";
import type { LocaleKey } from "@/lib/site-settings-store";
import { redirect } from "next/navigation";
import { getAllDestinationSlugs } from "../../../../data/landing-pages";
import en from "../../../../messages/en.json";
import ja from "../../../../messages/ja.json";
import ko from "../../../../messages/ko.json";
import zh from "../../../../messages/zh.json";

type Props = {
  searchParams?: { previewLocale?: string };
};

export default async function AdminContentPage({ searchParams }: Props) {
  if (!isAdminAuthenticated()) redirect("/admin");

  const previewLocale = (
    searchParams?.previewLocale === "en" ||
    searchParams?.previewLocale === "ja" ||
    searchParams?.previewLocale === "zh"
      ? searchParams.previewLocale
      : "ko"
  ) as LocaleKey;

  const [settings, reservations, inquiries, vehicleMedia] = await Promise.all([
    getSiteSettings(),
    listReservations(),
    listSupportInquiries(),
    getManagedVehicleMedia(),
  ]);

  const messagesByLocale = {
    ko: ko as unknown as Record<string, unknown>,
    en: en as unknown as Record<string, unknown>,
    ja: ja as unknown as Record<string, unknown>,
    zh: zh as unknown as Record<string, unknown>,
  };

  const mergedContact = {
    kakao: settings.contactLinks.kakao || SITE_KAKAO_CHAT_URL,
    instagram: settings.contactLinks.instagram || SITE_INSTAGRAM_DM_URL,
    whatsapp: settings.contactLinks.whatsapp || SITE_WHATSAPP_URL,
    line: settings.contactLinks.line || SITE_LINE_URL,
    messenger: settings.contactLinks.messenger || SITE_FACEBOOK_MESSENGER_URL,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">홈페이지 비주얼 편집</h1>
      <AdminNavTabs
        currentPath="/admin/content"
        reservationsCount={reservations.length}
        inquiriesCount={inquiries.length}
      />
      <div className="mt-6">
        <AdminHomeVisualEditor
          initialSettings={settings}
          previewLocale={previewLocale}
          messagesByLocale={messagesByLocale}
          vehicleMediaMain={vehicleMedia.main}
          destinationSlugs={getAllDestinationSlugs()}
          mergedContact={mergedContact}
        />
      </div>
    </div>
  );
}
