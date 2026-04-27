"use client";

import { useTranslations } from "next-intl";
import {
  SITE_FACEBOOK_MESSENGER_URL,
  SITE_INSTAGRAM_DM_URL,
  SITE_KAKAO_CHAT_URL,
  SITE_LINE_URL,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type QuickKey = "call" | "kakao" | "whatsapp" | "line" | "instaDm" | "messenger";

type QuickItem = {
  key: QuickKey;
  label: string;
  iconSrc: string;
  href: string;
  external?: boolean;
  emphasis?: boolean;
};

const quickItems: QuickItem[] = [
  { key: "call", label: "전화", iconSrc: "/icons/phone.svg", href: SITE_PHONE_TEL, emphasis: true },
  { key: "kakao", label: "카톡", iconSrc: "/icons/kakao.svg", href: SITE_KAKAO_CHAT_URL, external: true, emphasis: true },
  { key: "whatsapp", label: "왓츠앱", iconSrc: "/icons/whatsapp.svg", href: SITE_WHATSAPP_URL, external: true },
  { key: "line", label: "라인", iconSrc: "/icons/line.svg", href: SITE_LINE_URL, external: true },
  { key: "instaDm", label: "인스타DM", iconSrc: "/icons/instagram.svg", href: SITE_INSTAGRAM_DM_URL, external: true },
  { key: "messenger", label: "메신저", iconSrc: "/icons/messenger.svg", href: SITE_FACEBOOK_MESSENGER_URL, external: true },
];

function DesktopItem({ item }: { item: QuickItem }) {
  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      aria-label={item.label}
      title={item.label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border",
        "bg-surface-elevated/90 text-foreground transition-all duration-200 hover:border-brand-gold/60 hover:bg-brand-deep-soft",
        item.emphasis && "border-brand-gold/35 bg-brand-deep text-primary-foreground"
      )}
    >
      <img src={item.iconSrc} alt="" className="h-4 w-4" aria-hidden />
      <span className="sr-only">{item.label}</span>
    </a>
  );
}

export function QuickMenu() {
  const t = useTranslations("QuickMenu");

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-brand-black/94 px-2 py-2 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-content grid-cols-4 gap-1.5 pb-[max(0rem,env(safe-area-inset-bottom))]">
          {quickItems.map((item) => {
            return (
              <a
                href={item.href}
                key={item.key}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                aria-label={item.label}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg border border-border/80",
                  "bg-surface-elevated/90 text-foreground transition active:scale-[0.98]",
                  item.emphasis && "border-brand-gold/35 bg-brand-deep text-primary-foreground"
                )}
              >
                <img src={item.iconSrc} alt="" className="h-3.5 w-3.5" aria-hidden />
                <span className="text-[9px] font-medium leading-none">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      <aside
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 rounded-xl border border-border/80 bg-brand-black/84 p-1.5 shadow-xl backdrop-blur md:block"
        aria-label={t("title")}
      >
        <div className="flex flex-col gap-1.5">
          {quickItems.map((item) => (
            <DesktopItem item={item} key={item.key} />
          ))}
        </div>
      </aside>
    </>
  );
}