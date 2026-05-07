"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { BRAND_LOGO_SRC, SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/site";

const NAV = [
  { msgKey: "navHome" as const, href: "/" },
  { msgKey: "navIntro" as const, href: "/intro" },
  { msgKey: "navVehicle" as const, href: "/vehicle" },
  { msgKey: "navPricing" as const, href: "/pricing" },
  { msgKey: "navBooking" as const, href: "/booking" },
  { msgKey: "navReview" as const, href: "/review" },
  { msgKey: "navSupport" as const, href: "/inquiry" },
] as const;

function normalizePath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];
  if (first && routing.locales.includes(first as (typeof routing.locales)[number])) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

function navLinkActive(pathname: string, href: string) {
  const p = normalizePath(pathname);
  if (href === "/") return p === "/" || p === "";
  return p === href || p.startsWith(`${href}/`);
}

export function Header({
  phoneDisplay = SITE_PHONE_DISPLAY,
  phoneTel = SITE_PHONE_TEL,
}: {
  phoneDisplay?: string;
  phoneTel?: string;
}) {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("mobile-menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-menu-open");
    };
  }, [open]);

  const mobileDrawer = (
    <div id="mobile-drawer" className={cn("fixed inset-0 z-[200] xl:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
      <button
        type="button"
        className={cn("absolute inset-0 bg-black/80 transition-opacity", open ? "opacity-100" : "opacity-0")}
        onClick={() => setOpen(false)}
        aria-label={t("closeMenu")}
      />

      <div className={cn("fixed right-0 top-0 bottom-0 flex w-full max-w-[22rem] flex-col border-l border-white/10 bg-[#04070d] shadow-[0_18px_44px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out overflow-y-auto", open ? "translate-x-0" : "translate-x-full")}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-sm font-semibold">{t("brand")}</span>
            <a
              href={phoneTel}
              className="inline-flex items-center gap-2 rounded-full border border-brand-gold/45 bg-[linear-gradient(180deg,rgba(212,175,55,0.2),rgba(212,175,55,0.1))] px-4 py-2.5 text-sm font-bold text-brand-gold shadow-[0_4px_16px_rgba(212,175,55,0.22)]"
              onClick={() => setOpen(false)}
            >
              <Image src="/icons/phone.svg" alt="" width={20} height={20} className="h-5 w-5 shrink-0" aria-hidden />
              <span className="font-numeric tabular-nums">{phoneDisplay}</span>
            </a>
          </div>
          <button type="button" className="rounded-lg p-2 text-tone-soft hover:bg-surface hover:text-tone-sky" onClick={() => setOpen(false)} aria-label={t("closeMenu")}>
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <nav className="grid gap-1 p-3 pb-6" aria-label={t("navMain")}>
          {NAV.map(({ msgKey, href }) => (
            <Link
              key={msgKey}
              href={href}
              className={cn(
                "rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-white/5",
                navLinkActive(pathname, href) ? "text-brand-gold" : "text-white/90",
              )}
              onClick={() => setOpen(false)}
            >
              {t(msgKey)}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-black/94 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      <div className="mx-auto flex min-h-[3.75rem] max-w-content items-center justify-between gap-3 px-4 py-2 sm:min-h-[4.25rem] sm:gap-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5 md:gap-6">
          <Link href="/" className="flex min-w-0 shrink-0 items-center">
            <Image
              src={BRAND_LOGO_SRC}
              alt={t("brand")}
              width={200}
              height={56}
              priority
              className="h-10 w-auto object-contain sm:h-11 md:h-12"
            />
          </Link>
          <a
            href={phoneTel}
            className="inline-flex min-h-[2.75rem] max-w-full shrink items-center gap-2 rounded-full border border-brand-gold/40 bg-[linear-gradient(180deg,rgba(212,175,55,0.2),rgba(212,175,55,0.1))] px-3 py-2 text-xs font-bold text-brand-gold shadow-[0_4px_18px_rgba(212,175,55,0.2)] transition hover:border-brand-gold/65 hover:text-[#f2d78e] sm:px-5 sm:text-sm md:text-base"
            aria-label={`${t("phoneAria")}: ${phoneDisplay}`}
          >
            <Image src="/icons/phone.svg" alt="" width={20} height={20} className="h-5 w-5 shrink-0" aria-hidden />
            <span className="font-numeric tabular-nums tracking-tight">{phoneDisplay}</span>
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1.5 xl:flex" aria-label={t("navMain")}>
            {NAV.map(({ msgKey, href }) => {
              const active = navLinkActive(pathname, href);
              return (
                <Link
                  key={msgKey}
                  href={href}
                  className={cn(
                    "rounded-lg px-2.5 py-2 text-[13px] font-semibold tracking-wide transition-colors sm:px-3 sm:text-sm",
                    active
                      ? "text-brand-gold"
                      : "text-white/88 hover:bg-white/5 hover:text-brand-gold",
                  )}
                >
                  {t(msgKey)}
                </Link>
              );
            })}
          </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-black/35 text-foreground transition hover:bg-white/10 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
            <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
          </button>
        </div>
        </div>
      </div>

    </header>
    {mounted ? createPortal(mobileDrawer, document.body) : null}
    </>
  );
}