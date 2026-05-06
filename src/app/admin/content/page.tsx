import { AdminSiteSettingsForm } from "@/components/admin/AdminSiteSettingsForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/site-settings-store";
import { redirect } from "next/navigation";

export default async function AdminContentPage() {
  if (!isAdminAuthenticated()) redirect("/admin");

  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">콘텐츠 관리</h1>
      <p className="mt-2 text-sm text-tone-body">
        사장님이 직접 수정할 수 있는 홈 콘텐츠(About Me 문구, 갤러리 이미지 URL)를 관리합니다.
      </p>
      <div className="mt-6">
        <AdminSiteSettingsForm initial={settings} />
      </div>
    </div>
  );
}
