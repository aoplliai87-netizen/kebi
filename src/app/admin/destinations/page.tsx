import { AdminDestinationLandingOverridesEditor } from "@/components/admin/AdminDestinationLandingOverridesEditor";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listReservations } from "@/lib/reservation-store";
import { getSiteSettings } from "@/lib/site-settings-store";
import { listSupportInquiries } from "@/lib/support-inquiry-store";
import type { LocaleKey } from "@/lib/site-settings-store";
import { redirect } from "next/navigation";
import en from "../../../../messages/en.json";
import ja from "../../../../messages/ja.json";
import ko from "../../../../messages/ko.json";
import zh from "../../../../messages/zh.json";
import { getAllDestinationSlugs } from "../../../../data/landing-pages";

type Props = {
  searchParams?: { editLocale?: string };
};

export default async function AdminDestinationsPage({ searchParams }: Props) {
  if (!isAdminAuthenticated()) redirect("/admin");

  const editLocale = (
    searchParams?.editLocale === "en" ||
    searchParams?.editLocale === "ja" ||
    searchParams?.editLocale === "zh"
      ? searchParams.editLocale
      : "ko"
  ) as LocaleKey;

  const [settings, reservations, inquiries] = await Promise.all([
    getSiteSettings(),
    listReservations(),
    listSupportInquiries(),
  ]);

  const messagesByLocale = {
    ko: ko as unknown as Record<string, unknown>,
    en: en as unknown as Record<string, unknown>,
    ja: ja as unknown as Record<string, unknown>,
    zh: zh as unknown as Record<string, unknown>,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">목적지 SEO 랜딩 편집</h1>
      <p className="mt-2 text-sm text-tone-body">
        각 슬러그별 히어로·본문·FAQ·CTA·히어로 이미지 오버라이드를 저장합니다. 비워 두면{" "}
        <code className="rounded bg-black/30 px-1 font-mono text-xs">data/landing-pages</code> 기본값이 노출됩니다.
      </p>
      <AdminNavTabs
        currentPath="/admin/destinations"
        reservationsCount={reservations.length}
        inquiriesCount={inquiries.length}
      />
      <div className="mt-6">
        <AdminDestinationLandingOverridesEditor
          initialSettings={settings}
          destinationSlugs={getAllDestinationSlugs()}
          messagesByLocale={messagesByLocale}
          editLocale={editLocale}
        />
      </div>
    </div>
  );
}
