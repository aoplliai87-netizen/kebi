"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { SITE_KAKAO_CHAT_URL, SITE_PHONE_TEL } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Primary CTA와 동일한 골드 토큰 (Button primary variant와 정렬) */
const bookBtnClass =
  "bg-brand-gold text-accent-foreground shadow-sm hover:brightness-110 active:brightness-95 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * 모바일 전용 하단 영업 바 — 엄지 닿는 하단·큰 타겟·전화/카톡 시인성
 */
export function MobileFloatingBar() {
  const t = useTranslations("FloatingBar");
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 md:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2",
        "pointer-events-none"
      )}
      role="presentation"
    >
      <div className="pointer-events-auto mx-auto max-w-content px-3">
        <div
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] items-end gap-2",
            "rounded-2xl border border-border bg-surface-elevated/95 p-2 shadow-[0_-8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md"
          )}
        >
          <a
            href={SITE_PHONE_TEL}
            className={cn(
              "flex min-h-[3.75rem] flex-col items-center justify-center gap-1 rounded-xl",
              "bg-brand-deep text-primary-foreground shadow-inner ring-1 ring-white/10",
              "transition-transform active:scale-[0.98]"
            )}
            aria-label={t("callAria")}
          >
            <Phone className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
            <span className="text-[11px] font-semibold leading-none">{t("call")}</span>
          </a>

          <div className="relative flex justify-center pb-1">
            <Link
              href={`${pathname}#booking`}
              className={cn(
                bookBtnClass,
                "inline-flex min-h-[4.25rem] w-full max-w-[11rem] -translate-y-1 flex-col items-center justify-center gap-1 rounded-2xl px-6 py-2.5 text-center shadow-lg transition-transform active:scale-[0.98]",
                "text-[13px] font-semibold tracking-tight"
              )}
              aria-label={t("bookAria")}
            >
              <span className="text-[15px] leading-tight">{t("book")}</span>
            </Link>
          </div>

          <a
            href={SITE_KAKAO_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex min-h-[3.75rem] flex-col items-center justify-center gap-1 rounded-xl",
              "bg-[#FEE500] text-[#191919] shadow-inner ring-1 ring-black/10",
              "transition-transform active:scale-[0.98]"
            )}
            aria-label={t("kakaoAria")}
          >
            <MessageCircle className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
            <span className="text-[11px] font-bold leading-none">{t("kakao")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
