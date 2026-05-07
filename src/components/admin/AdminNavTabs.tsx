import Link from "next/link";

type AdminTab = {
  href: string;
  label: string;
  desc: string;
  count?: number;
};

type Props = {
  currentPath: string;
  reservationsCount?: number;
  inquiriesCount?: number;
};

export function AdminNavTabs({ currentPath, reservationsCount, inquiriesCount }: Props) {
  const tabs: AdminTab[] = [
    { href: "/admin", label: "대시보드", desc: "요약" },
    { href: "/admin/content", label: "홈페이지 관리", desc: "문구/갤러리/연락처" },
    { href: "/admin/vehicles", label: "차량 비주얼", desc: "실제 페이지 편집" },
    { href: "/admin/review", label: "리뷰 비주얼", desc: "실제 페이지 편집" },
    { href: "/admin/booking", label: "예약 비주얼", desc: "실제 페이지 편집" },
    { href: "/admin/inquiry", label: "문의 비주얼", desc: "실제 페이지 편집" },
    { href: "/admin/intro", label: "소개 비주얼", desc: "실제 페이지 편집" },
    { href: "/admin/pricing", label: "요금표 관리", desc: "/pricing 상세표" },
    { href: "/admin/seo", label: "SEO 관리", desc: "개발자용 메타" },
    { href: "/admin/reservations", label: "예약 관리", desc: "예약 접수", count: reservationsCount },
    { href: "/admin/inquiries", label: "문의 관리", desc: "문의 내역", count: inquiriesCount },
  ];

  return (
    <nav className="mt-5 grid gap-2 rounded-xl border border-white/10 bg-black/25 p-2 sm:grid-cols-2 lg:grid-cols-4">
      {tabs.map((tab) => {
        const active = currentPath === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${
              active
                ? "border-brand-gold/60 bg-brand-gold/15 text-brand-gold"
                : "border-white/12 bg-black/20 text-tone-strong hover:border-brand-gold/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{tab.label}</span>
              {typeof tab.count === "number" ? (
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs tabular-nums">
                  {tab.count}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-xs text-tone-soft">{tab.desc}</p>
          </Link>
        );
      })}
    </nav>
  );
}
