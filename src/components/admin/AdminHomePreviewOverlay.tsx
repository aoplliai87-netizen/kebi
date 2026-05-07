"use client";

import Link from "next/link";

type Props = {
  locale: "ko" | "en" | "ja" | "zh";
};

const EDIT_LINKS = [
  { tab: "home", label: "히어로/어바웃 수정" },
  { tab: "intro", label: "인트로 수정" },
  { tab: "gallery", label: "갤러리 수정" },
  { tab: "booking", label: "예약 CTA 수정" },
  { tab: "reviews", label: "후기 수정" },
  { tab: "faq", label: "FAQ 수정" },
] as const;

export function AdminHomePreviewOverlay({ locale }: Props) {
  return (
    <div className="pointer-events-none absolute right-3 top-3 z-20 flex max-w-[90%] flex-wrap justify-end gap-2">
      <span className="rounded-full border border-brand-gold/35 bg-black/75 px-2.5 py-1 text-[11px] font-semibold text-brand-gold">
        ADMIN PREVIEW · {locale.toUpperCase()}
      </span>
      {EDIT_LINKS.map((item) => (
        <Link
          key={item.tab}
          href={`/admin/content?tab=${item.tab}`}
          className="pointer-events-auto rounded-full border border-white/25 bg-black/75 px-2.5 py-1 text-[11px] font-semibold text-tone-strong hover:border-brand-gold/45 hover:text-brand-gold"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
