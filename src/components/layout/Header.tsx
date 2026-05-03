"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
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

export function Header() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
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
            href={SITE_PHONE_TEL}
            className="inline-flex min-h-[2.75rem] max-w-full shrink items-center gap-2 rounded-xl bg-gradient-to-b from-brand-gold via-[#e6c24a] to-[#b8892a] px-3 py-2 text-xs font-bold text-black shadow-[0_4px_20px_rgba(212,175,55,0.45)] transition hover:brightness-110 sm:px-5 sm:text-sm md:text-base"
            aria-label={`${t("phoneAria")}: ${SITE_PHONE_DISPLAY}`}
          >
            <Phone className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
            <span className="font-numeric tabular-nums tracking-tight">{SITE_PHONE_DISPLAY}</span>
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
          <div
            className="flex rounded-xl border border-white/12 bg-black/30 p-0.5 shadow-inner shadow-black/40"
            role="group"
            aria-label={t("langHint")}
          >
            {routing.locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                className={cn(
                  "min-w-[2.75rem] rounded-lg px-2.5 py-2 text-center text-xs font-bold uppercase tracking-wide transition-colors sm:text-[13px]",
                  locale === loc
                    ? "bg-brand-gold text-black shadow-[0_2px_12px_rgba(212,175,55,0.4)]"
                    : "text-white/75 hover:bg-white/10 hover:text-brand-gold",
                )}
              >
                {loc === "ko" ? t("langKo") : t("langEn")}
              </Link>
            ))}
          </div>

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

      <div id="mobile-drawer" className={cn("fixed inset-0 z-50 xl:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
        <button
          type="button"
          className={cn("absolute inset-0 bg-black/60 transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
          aria-label={t("closeMenu")}
        />

        <div className={cn("absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-border bg-brand-black shadow-xl transition-transform duration-300 ease-out", open ? "translate-x-0" : "translate-x-full")}> 
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-sm font-semibold">{t("brand")}</span>
              <a
                href={SITE_PHONE_TEL}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-brand-gold via-[#e6c24a] to-[#b8892a] px-4 py-2.5 text-sm font-bold text-black shadow-[0_4px_16px_rgba(212,175,55,0.35)]"
                onClick={() => setOpen(false)}
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                <span className="font-numeric tabular-nums">{SITE_PHONE_DISPLAY}</span>
              </a>
            </div>
            <button type="button" className="rounded-lg p-2 text-tone-soft hover:bg-surface hover:text-tone-sky" onClick={() => setOpen(false)} aria-label={t("closeMenu")}>
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3" aria-label={t("navMain")}>
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
    </header>
  );
}