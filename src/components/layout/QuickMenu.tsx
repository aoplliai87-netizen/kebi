"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSiteRuntime } from "@/components/providers/SiteRuntimeProvider";
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

function DesktopItem({ item }: { item: QuickItem }) {
  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      aria-label={item.label}
      title={item.label}
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border",
        "bg-surface-elevated/90 text-foreground transition-all duration-200 hover:border-brand-gold/60 hover:bg-brand-deep-soft",
        item.key === "call" && "border-emerald-400/70 bg-emerald-500/18 shadow-[0_8px_22px_rgba(16,185,129,0.22)]",
        item.emphasis && item.key !== "call" && "border-brand-gold/35 bg-brand-deep text-primary-foreground"
      )}
    >
      <Image src={item.iconSrc} alt="" width={20} height={20} className="h-5 w-5" aria-hidden />
      <span className="sr-only">{item.label}</span>
    </a>
  );
}

export function QuickMenu() {
  const t = useTranslations("QuickMenu");
  const { phoneTel, links } = useSiteRuntime();
  const quickItems: QuickItem[] = [
    { key: "call", label: t("label.call"), iconSrc: "/icons/phone.svg", href: phoneTel, emphasis: true },
    { key: "kakao", label: t("label.kakao"), iconSrc: "/icons/kakao.svg", href: links.kakao, external: true, emphasis: true },
    { key: "whatsapp", label: t("label.whatsapp"), iconSrc: "/icons/whatsapp.svg", href: links.whatsapp, external: true },
    { key: "line", label: t("label.line"), iconSrc: "/icons/line.svg", href: links.line, external: true },
    { key: "instaDm", label: t("label.instaDm"), iconSrc: "/icons/instagram.svg", href: links.instagram, external: true },
    { key: "messenger", label: t("label.messenger"), iconSrc: "/icons/messenger.svg", href: links.messenger, external: true },
  ];

  return (
    <>
      <div className="mobile-quick-menu fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-brand-black/94 px-2 py-2 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-content grid-cols-3 gap-1.5 pb-[max(0rem,env(safe-area-inset-bottom))]">
          {quickItems.map((item) => {
            return (
              <a
                href={item.href}
                key={item.key}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                aria-label={item.label}
                className={cn(
                  "flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-lg border border-border/80",
                  "bg-surface-elevated/90 text-foreground transition active:scale-[0.98]",
                  item.key === "call" && "border-emerald-400/70 bg-emerald-500/18",
                  item.emphasis && item.key !== "call" && "border-brand-gold/35 bg-brand-deep text-primary-foreground"
                )}
              >
                <Image src={item.iconSrc} alt="" width={16} height={16} className="h-4 w-4" aria-hidden />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      <aside
        className="mobile-quick-menu fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 rounded-2xl border border-border/80 bg-brand-black/84 p-2 shadow-xl backdrop-blur md:block"
        aria-label={t("title")}
      >
        <div className="flex flex-col gap-2">
          {quickItems.map((item) => (
            <DesktopItem item={item} key={item.key} />
          ))}
        </div>
      </aside>
    </>
  );
}