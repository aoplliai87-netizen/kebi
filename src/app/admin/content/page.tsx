import { AdminSiteSettingsForm } from "@/components/admin/AdminSiteSettingsForm";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { AdminHomeLivePreview } from "@/components/admin/AdminHomeLivePreview";
import { buildAdminContentFallbacks } from "@/lib/admin-content-fallbacks";
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
import { redirect } from "next/navigation";
import Link from "next/link";

const CONTENT_TABS = [
  "home",
  "intro",
  "vehicle",
  "pricing",
  "gallery",
  "contact",
  "booking",
  "reviews",
  "faq",
  "subpages",
] as const;
type ContentTab = (typeof CONTENT_TABS)[number];

type Props = {
  searchParams?: { tab?: string; previewLocale?: string };
};

export default async function AdminContentPage({ searchParams }: Props) {
  if (!isAdminAuthenticated()) redirect("/admin");
  const requestedTab = searchParams?.tab;
  const initialTab: ContentTab = CONTENT_TABS.includes(requestedTab as ContentTab)
    ? (requestedTab as ContentTab)
    : "home";
  const previewLocale = (
    searchParams?.previewLocale === "en" ||
    searchParams?.previewLocale === "ja" ||
    searchParams?.previewLocale === "zh"
      ? searchParams.previewLocale
      : "ko"
  ) as "ko" | "en" | "ja" | "zh";

  const [settings, reservations, inquiries, vehicleMedia, fallbackHints] = await Promise.all([
    getSiteSettings(),
    listReservations(),
    listSupportInquiries(),
    getManagedVehicleMedia(),
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
      <h1 className="text-3xl font-bold text-tone-strong md:text-4xl">홈페이지 관리</h1>
      <p className="mt-2 text-sm text-tone-body">
        홈페이지와 같은 섹션 순서로 바로 수정할 수 있습니다. 각 섹션의 <strong>바로가기</strong>를 누르면 해당 편집 탭으로 이동합니다.
      </p>
      <AdminNavTabs
        currentPath="/admin/content"
        reservationsCount={reservations.length}
        inquiriesCount={inquiries.length}
      />
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { id: "home", label: "히어로 + About", desc: "상단 메인 카피·연락 카드 위 소개", tone: "from-[#1f3658] to-[#0c1624]" },
          { id: "intro", label: "인트로 대형 섹션", desc: "IntroPage.hero (본문·브랜드 태그)", tone: "from-[#2a3f5c] to-[#0f1826]" },
          { id: "vehicle", label: "차량 섹션", desc: "홈 차량 소개 문구", tone: "from-[#18425a] to-[#0c1d27]" },
          { id: "pricing", label: "홈 요금 카드", desc: "메인 카드 3개", tone: "from-[#5a3f17] to-[#221706]" },
          { id: "gallery", label: "갤러리", desc: "홈 이미지 영역", tone: "from-[#3f2c59] to-[#161022]" },
          { id: "contact", label: "문의 채널", desc: "전화/카카오/왓츠앱", tone: "from-[#1f3d2a] to-[#0c1c13]" },
          { id: "booking", label: "예약 CTA", desc: "온라인 예약 섹션", tone: "from-[#1e4a40] to-[#0c221c]" },
          { id: "reviews", label: "후기", desc: "홈 고객 후기 3건", tone: "from-[#4a3a1a] to-[#1c1408]" },
          { id: "faq", label: "FAQ", desc: "홈 하단 질문 5개", tone: "from-[#2d3550] to-[#121520]" },
          { id: "subpages", label: "서브페이지 CMS", desc: "booking/inquiry/intro/review 본문", tone: "from-[#2d3b64] to-[#121a2e]" },
        ].map((item) => (
          <Link
            key={item.id}
            href={`/admin/content?tab=${item.id}`}
            className={`rounded-xl border border-white/10 bg-gradient-to-br ${item.tone} p-4 transition hover:border-brand-gold/45`}
          >
            <p className="text-sm font-bold text-tone-strong">{item.label}</p>
            <p className="mt-1 text-xs text-tone-soft">{item.desc}</p>
            <p className="mt-3 text-xs font-semibold text-brand-gold">편집 바로가기</p>
          </Link>
        ))}
      </section>
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="text-tone-soft">미리보기 언어:</span>
          {(["ko", "en", "ja", "zh"] as const).map((loc) => (
            <Link
              key={loc}
              href={`/admin/content?tab=${initialTab}&previewLocale=${loc}`}
              className={`rounded-md border px-2 py-1 font-semibold ${
                previewLocale === loc
                  ? "border-brand-gold/55 bg-brand-gold/15 text-brand-gold"
                  : "border-white/20 bg-black/25 text-tone-strong"
              }`}
            >
              {loc.toUpperCase()}
            </Link>
          ))}
        </div>
        <AdminHomeLivePreview
          locale={previewLocale}
          siteSettings={settings}
          vehicleMedia={vehicleMedia}
          mergedContact={mergedContact}
        />
      </div>
      <div className="mt-6">
        <AdminSiteSettingsForm
          initial={settings}
          fallbackHints={fallbackHints}
          initialTab={initialTab}
          allowedTabs={[
            "home",
            "intro",
            "vehicle",
            "pricing",
            "gallery",
            "contact",
            "booking",
            "reviews",
            "faq",
            "subpages",
          ]}
        />
      </div>
    </div>
  );
}
